from fastapi import APIRouter, BackgroundTasks, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from models.graph import Graph, Query

router = APIRouter(prefix='/graph', tags=['graph'])

@router.post('')
async def create_kg():
    pass

@router.get('')
async def get_full_kg():
    pass

@router.get('/{doc_id}')
async def get_kg_for_doc():
    pass

@router.post('/query')
async def query_on_kg():
    pass

