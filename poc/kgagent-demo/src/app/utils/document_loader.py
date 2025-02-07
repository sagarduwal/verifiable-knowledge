from langchain.docstore.document import Document
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import TokenTextSplitter, RecursiveCharacterTextSplitter


def load_document(path: str):
    try:
        loader = TextLoader(path)
        content = loader.load()
        document = Document(content=content)
        return document
    except Exception as e:
        raise e


def split_docs(document, metadata):
    _documents = TokenTextSplitter(chunk_size=2048, chunk_overlap=100).split_documents(
        [Document(metadata=metadata, page_content=document)]
    )
    return _documents
