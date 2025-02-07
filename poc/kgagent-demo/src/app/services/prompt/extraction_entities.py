from langchain.prompts import ChatPromptTemplate

extract_entities_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Extract noun from the text, including organization name and person name",
        ),
        (
            "human",
            "Use the format to extract information from following inuput : (query)",
        ),
    ]
)
