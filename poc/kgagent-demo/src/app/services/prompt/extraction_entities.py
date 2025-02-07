from langchain.prompts import ChatPromptTemplate

extract_entities_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Identify and list all named entities in the text that are either people or organizations",
        ),
        (
            "human",
            "Use the format to extract information from following inuput : {query}",
        ),
    ]
)
