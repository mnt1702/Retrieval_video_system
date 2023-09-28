import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

def translate_vi2en(tokenizer_vi2en, model_vi2en, vi_texts: str) -> str:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_vi2en.to(torch.device(device)) 
    input_ids = tokenizer_vi2en(vi_texts, padding=True, return_tensors="pt").to(torch.device(device))
    output_ids = model_vi2en.generate(
        **input_ids,
        decoder_start_token_id=tokenizer_vi2en.lang_code_to_id["en_XX"],
        num_return_sequences=1,
        num_beams=5,
        early_stopping=True
    )
    en_texts = tokenizer_vi2en.batch_decode(output_ids, skip_special_tokens=True)
    return en_texts

# if __name__ == '__main__':
#     tokenizer_vi2en = AutoTokenizer.from_pretrained("vinai/vinai-translate-vi2en", src_lang="vi_VN")
#     model_vi2en = AutoModelForSeq2SeqLM.from_pretrained("vinai/vinai-translate-vi2en")
#     vi_text = "Cô cho biết: trước giờ tôi không đến phòng tập công cộng, mà tập cùng giáo viên Yoga riêng hoặc tự tập ở nhà. Khi tập thể dục trong không gian riêng tư, tôi thoải mái dễ chịu hơn."
#     print(translate_vi2en(tokenizer_vi2en, model_vi2en, vi_text))