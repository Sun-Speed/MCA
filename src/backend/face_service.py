
import base64
import binascii
import numpy as np
import cv2

from deepface import DeepFace


MODEL_NAME = "Facenet512"


def decode_base64_image(image_data: str) -> np.ndarray:
    """Convert a Base64 image or data URL into an OpenCV image."""

    if not image_data:
        raise ValueError("No image data was provided.")

    encoded = image_data

    if "," in encoded and encoded.startswith("data:"):
        encoded = encoded.split(",", 1)[1]

    try:
        image_bytes = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ValueError("Invalid Base64 image data.") from exc

    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("The supplied data is not a valid image.")

    if image.size == 0:
        raise ValueError("The supplied image is empty.")

    return image



def get_face_embedding(image: np.ndarray) -> list[float]:
    """Extract one face embedding from an image."""

    if image is None or image.size == 0:
        raise ValueError("Cannot process an empty image.")

    if image.ndim not in (2, 3):
        raise ValueError(
            f"Unsupported image dimensions: {image.shape}"
        )

    if image.ndim == 3 and image.shape[2] not in (3, 4):
        raise ValueError(
            f"Unsupported image channels: {image.shape}"
        )

    # RetinaFace can be more robust than OpenCV for difficult lighting.
    faces = DeepFace.represent(
        img_path=image,
        model_name=MODEL_NAME,
        detector_backend="retinaface",
        enforce_detection=True,
        align=True,
    )

    if not faces:
        raise ValueError("No face was detected in the image.")

    if len(faces) != 1:
        raise ValueError(
            "The image must contain exactly one clearly detected face."
        )

    embedding = faces[0].get("embedding")

    if embedding is None or len(embedding) == 0:
        raise ValueError("Face embedding could not be generated.")

    return [float(value) for value in embedding]


def cosine_similarity(
    first: list[float],
    second: list[float],
) -> float:
    """Return cosine similarity between two face embeddings."""

    a = np.asarray(first, dtype=np.float32)
    b = np.asarray(second, dtype=np.float32)

    if a.shape != b.shape:
        raise ValueError("Face embeddings have incompatible dimensions.")

    denominator = np.linalg.norm(a) * np.linalg.norm(b)

    if denominator == 0:
        raise ValueError("Cannot compare an empty face embedding.")

    return float(np.dot(a, b) / denominator)
