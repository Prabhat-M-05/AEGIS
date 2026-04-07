import os
import cv2
import json
import httpx
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from insightface.app import FaceAnalysis
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_GATEWAY_URL = os.getenv("API_GATEWAY_URL")
NODE_SERVER_URL = os.getenv("NODE_SERVER_URL", "http://localhost:3002")

# ===== LOAD MODEL =====
print("Loading InsightFace model...")
face_app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])

# 🔥 Improved detection size
face_app.prepare(ctx_id=0, det_size=(1280, 1280))

print("InsightFace ready.")


@app.post("/search")
async def search_face(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        print("File name:", file.filename)
        print("Content type:", file.content_type)
        print("File size:", len(contents))

        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file received")

        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_UNCHANGED)

        if img is None:
            from PIL import Image
            import io
            try:
                pil_img = Image.open(io.BytesIO(contents)).convert("RGB")
                img = np.array(pil_img)
                img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid image file")
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        faces = face_app.get(img)
        print("Faces detected:", len(faces))

        if not faces:
            return {"found": False, "matches": [], "message": "No face detected"}

        face = max(
            faces,
            key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1])
        )

        if face.embedding is None:
            raise HTTPException(status_code=500, detail="Embedding not generated")

        embedding = face.embedding.tolist()

        # 🔥 CHECK ENV
        if not API_GATEWAY_URL:
            raise HTTPException(status_code=500, detail="API_GATEWAY_URL not set")

        async with httpx.AsyncClient(timeout=30) as client:
            lambda_res = await client.post(
                API_GATEWAY_URL,
                json={"embedding": embedding, "threshold": 0.4, "top_k": 5}
            )

        print("Lambda status:", lambda_res.status_code)
        print("Lambda response:", lambda_res.text)

        try:
            result = lambda_res.json()
        except Exception:
            raise HTTPException(status_code=500, detail="Invalid response from Lambda")

        return result

    except Exception as e:
        print("ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}