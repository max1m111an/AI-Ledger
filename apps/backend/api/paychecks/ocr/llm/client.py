from ollama import Client

MODEL_NAME = "gemma3:1b"

_client = Client(host="http://ollama:11434")


def ask_llm(prompt: str) -> str:
    try:
        response = _client.chat(
            model=MODEL_NAME,
            options={
                "temperature": 0.0,
                "top_p": 0.6,
                "num_predict": 10
            },
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response["message"]["content"].strip()
    except Exception:
        return "other"
