
from flask import Flask, render_template, request, jsonify
from datetime import date

app = Flask(__name__, template_folder=".", static_folder=".", static_url_path="")

@app.route("/")
def home():
    return render_template("dashboard.html", today=date.today().isoformat())

@app.route("/generate-plan", methods=["POST"])
def generate_plan():
    tasks = request.json["tasks"]

    for task in tasks:
        if task["deadline"] < date.today().isoformat():
            return jsonify({"error": "Choose today or a future date."}), 400

    tasks.sort(key=lambda x: x["deadline"])
    return jsonify({"plan": tasks})

if __name__ == "__main__":
    app.run(debug=True)
