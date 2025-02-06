from typing import Text

from fastapi import APIRouter, BackgroundTasks, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from models.graph import GraphModel
from models.query import QueryModel

router = APIRouter(prefix='/graph', tags=['graph'])

@router.post('')
async def create_kg(data: GraphModel):
    try:
        data = data.model_dump()
        document_id  = data['document_id']
        # check document id exists in graph
        # generate graph creation 
        
        return JSONResponse(
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                             detail=e)
        

@router.get('')
async def get_full_kg():
    try:
        # get graph from db
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                'data': ''
            }
        )
    except Exception as e:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e
        )

@router.get('/{doc_id}')
async def get_kg_for_doc(doc_id: Text):
    try:
        # check if document exists in graph
        # get graph for doc id
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                'data': ''
            }
        )
    except Exception as e:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e
        )
    

@router.post('/query')
async def query_on_kg(query: QueryModel):
    try:
        query = query.model_dump()
        query_str = query.get('query')
        documents = query.get('documents')
        # get relationships for the query from the documents in graph
        
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={'data': ''}
        )
        
    except Exception as e:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e
        )

