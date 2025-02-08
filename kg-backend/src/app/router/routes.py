import hashlib
from typing import Text

from fastapi import APIRouter, BackgroundTasks, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from models import GraphModel, QueryModel
from services.graph.query import *

router = APIRouter(prefix="/graph", tags=["graph"])


@router.post("")
async def create_kg(data: GraphModel):
    try:
        data = data.model_dump()
        document_id = data.get("document_id")
        url = data.get("url")

        if not document_id and url:
            document_id = hashlib.md5(url.encode()).hexdigest()
            print(f"{url} {document_id}")
        elif not document_id and not url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either document_id or url must be provided",
            )

        # check document id exists in graph
        doc_exists = check_doc_exists_in_graph(document_id)
        print(f"Doc exists: {doc_exists}")
        if doc_exists:
            return HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document already exist in graph",
            )

        # generate graph creation
        await process_graph_generate(data=data)

        return JSONResponse(status_code=status.HTTP_200_OK, content={"data": ""})
    except Exception as e:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e)


@router.get("")
async def get_full_kg():
    try:
        # get graph from db
        result = get_graph_data()[0]

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Getting all Knowledge Graph", "data": result},
        )
    except Exception as e:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e)


@router.get("/{doc_id}")
async def get_kg_for_doc(doc_id: str):
    try:
        # check if document exists in graph
        doc_exists = check_doc_exists_in_graph(doc_id)

        if not doc_exists:
            return HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document already exist in graph",
            )

        # get graph for doc id
        result = get_graph_data(doc_id)[0]
        nodes = []
        for item in result["nodes"]:
            nodes.append(
                {
                    "id": item["node_id"],
                    "label": item["import_name"],
                    "fill": "#A1867F",
                    "data": {
                        "category": item.get("category", ""),
                        "description": item["description"],
                    },
                }
            )
        for idx, item in enumerate(result["relationships"]):
            item.update({"id": idx + 1})
        result["nodes"] = nodes

        return JSONResponse(status_code=status.HTTP_200_OK, content={"data": result})
    except Exception as e:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e)


@router.post("/query")
async def query_on_kg(query: QueryModel):
    try:
        query = query.model_dump()
        query_str = query.get("query")
        documents = query.get("documents")
        # get relationships for the query from the documents in graph

        return JSONResponse(status_code=status.HTTP_200_OK, content={"data": ""})

    except Exception as e:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e)


@router.get("/{doc_id}/raw")
async def get_raw_kg_for_doc(doc_id: str):
    try:
        response = get_raw_graph_data(doc_id)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"data": response})
    except Exception as e:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e)
