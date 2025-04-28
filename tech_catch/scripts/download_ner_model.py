from transformers import AutoTokenizer, AutoModelForTokenClassification

model_id = "cl-tohoku/bert-base-japanese-v3"  
save_path = "tech_catch/model"  

# モデル＆トークナイザの取得
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForTokenClassification.from_pretrained(model_id)

# ローカルに保存
tokenizer.save_pretrained(save_path)
model.save_pretrained(save_path)

print("saved model")
