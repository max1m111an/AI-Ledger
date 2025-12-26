import re
import unicodedata


base_replacements = {
    'A': 'А',
    'B': 'В',
    'C': 'С',
    'E': 'Е',
    'H': 'Н',
    'K': 'К',
    'M': 'М',
    'O': 'О',
    'P': 'Р',
    'T': 'Т',
    'X': 'Х',
    'a': 'а',
    'c': 'с',
    'e': 'е',
    'o': 'о',
    'p': 'р',
    'x': 'х',
    'y': 'у',
}

second_replacements = {
    'W': 'Ш',
    'w': 'ш',
    'V': 'В',
    'v': 'в',
    's': 'с',
    'S': 'С',
    'k': 'к',
    'h': 'н',
    't': 'т',
    '≡': '=',
    'φ': 'ф',
    'i': 'и',
    '╣': '№',
    '<': '"',
    '>': '"',
    "'": '"',
    'u': 'ц',
    'd': 'д',
    'm': 'м',
    'n': 'п',
    'r': 'г',
}

word_replacements = {
    'шшш.': 'www.',
    'НDС': 'НДС',
    'МНН': 'ИНН',
    'ΦНN': 'ФНН',
    'uена': 'цена',
    'rrt': 'ккт',
    'кrт': 'ккт',
    'кливнта': 'клиента',
    'мir': 'мир',
    'аохо-расход': 'доход-расход',
    'аарес': 'адрес',
    'отiравитеjя': 'отправителя',
    'веzнаlичныi': 'безналичными',
    'оцлата': 'оплата',
    'безналичныи': 'безналичными',
    'кассцр': 'кассир',
    'нтог': 'итог',
    'йто': 'итог',
    'везналичными': 'безналичными',
    'ойозгавтся': 'облагается',
    'теефона': 'телефона',
    'саоба': 'сдоба',
    'помецений': 'помещений',
    'вреня': 'время',
    'автdмат': 'автомат',
    'комигсия': 'комиссия',
}


def collect_words(text, counter):
    words = re.findall(r'\b[a-zA-Zа-яА-ЯёЁ]+(?:\.\b)?', text)
    return counter.update(words)


def replace_multi(text, replacements):
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def prepare(text):
    text = unicodedata.normalize('NFC', text)
    text = replace_multi(text, base_replacements)
    text = replace_multi(text, second_replacements)
    text = re.sub(r'-{2,}', '\n', text)
    text = re.sub(r'\*{2,}', '\n', text)
    text = re.sub(r'\.{2,}', '.', text)
    text = re.sub(r'(?<!\w)Ne(?!\w)', '№', text)
    text = re.sub(r'(?<!\w)N(?!\w)', '№', text)
    text = text.lower()
    text = re.sub(r'(?<!\w)нас(?!\w)', 'ндс', text)
    return replace_multi(text, word_replacements)
