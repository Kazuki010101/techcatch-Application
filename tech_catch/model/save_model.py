from transformers import AutoTokenizer, AutoModelForTokenClassification

model_id = "ku-nlp/deberta-v2-base-japanese-ner"  # 好きな日本語NERモデル
save_path = "tech_catch/model"  # 保存先パス

# モデル＆トークナイザの取得
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForTokenClassification.from_pretrained(model_id)

# ローカルに保存
tokenizer.save_pretrained(save_path)
model.save_pretrained(save_path)

print("✅ モデルを保存しました！")
