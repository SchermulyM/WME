import csv
import jinja2

with open("world_data_v1.csv", encoding="UTF-8") as file:
    reader = csv.reader(file, delimiter=",")

    data = []

    for row in reader:
        row = tuple(map(lambda x: x.strip(), row))
        data.append(row)

env = jinja2.Environment(loader=jinja2.FileSystemLoader(""))
template = env.get_template("world_data_template.html")
output = template.render(data=data, enumerate=enumerate)

with open("world_data_rendered.html", "w", encoding="UTF-8") as file:
    file.write(output)

