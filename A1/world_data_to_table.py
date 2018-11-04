import csv
import jinja2

def prettify(s: str):
    x = s.strip()
    try:
        x = int(x)
    except ValueError:
        try:
            x = float(x)
            x = round(x, 2)
        except ValueError:
            pass
    return str(x)


with open("world_data_v1.csv", encoding="UTF-8") as file:
    reader = csv.reader(file, delimiter=",")

    data = []

    for row in reader:
        row = tuple(map(prettify, row))
        data.append(row[:7])

env = jinja2.Environment(loader=jinja2.FileSystemLoader(""))
template = env.get_template("world_data_template.html")
output = template.render(data=data, enumerate=enumerate)

with open("world_data_rendered.html", "w", encoding="UTF-8") as file:
    file.write(output)

