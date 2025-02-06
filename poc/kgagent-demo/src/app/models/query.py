from typing import List, Optional
from pydantic import BaseModel

class Query(BaseModel):
    query : str 
    documents : Optional[List[str]] = None