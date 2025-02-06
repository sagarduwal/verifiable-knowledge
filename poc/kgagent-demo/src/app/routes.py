from fastapi import APIRouter
from router.routes import router 

router_v1 = APIRouter(prefix="/api/v1")

router_v1.include_router(router)
