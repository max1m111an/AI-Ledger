PAYCHECK_CATEGORY_PROMT = """
You are given text extracted from a Russian receipt.
Your task is to classify the purchase category.

Possible categories:
Cafe - cafes, restaurants, coffee shops, fast food
Transport - public transport, taxi, fuel, car services
Utilities - коммунальные услуги, связь, интернет, мобильная связь
Healthcare - pharmacies, clinics, medical services
Marketplace - online marketplaces and delivery services
Entertainment - cinemas, subscriptions, развлечения
Transfer - bank transfers, cash withdrawal, P2P payments
Shop - retail stores and non-food purchases
Other - anything else

Rules:
- Answer with ONLY ONE category name from the list above
- Do NOT add explanations
- Do NOT add punctuation
- Use exactly the category name spelling

Receipt text:
{paycheck_text}

Category: """
