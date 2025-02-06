from typing import List, Optional
from pydantic import BaseModel

class QueryModel(BaseModel):
    query : str 
    documents : Optional[List[str]] = None