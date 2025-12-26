from rich.table import Table
from rich.console import Console
from rich.text import Text

console = Console()


def render_debug(lines, debug, span):
    table = Table(show_lines=True)
    table.add_column("#", justify="right", width=3)
    table.add_column("LINE", width=40)
    table.add_column("price")
    table.add_column("qty")
    table.add_column("pat")
    table.add_column("hard")
    table.add_column("f_start")
    table.add_column("f_end")
    table.add_column("score", justify="right")

    for i, (line, d) in enumerate(zip(lines, debug)):
        in_span = span[0] <= i <= span[1]

        score = d["score"]
        if score < 0:
            color = "red"
        elif 0 <= score <= 3:
            color = "yellow"
        else:
            color = "green"

        line_style = f"bold {color}" if in_span else color
        text = Text(line, style=line_style)

        index_text = Text(str(i), style="green" if in_span else "")

        table.add_row(
            index_text,
            text,
            "+" if d["patterns"]["has_price"] else "",
            "+" if d["patterns"]["has_qty"] else "",
            str(d["patterns"]["product_hits"]),
            "-" if d["parts"]["hard_stop"] < 0 else "",
            f"{d['fuzzy']['start']:.2f}",
            f"{d['fuzzy']['end']:.2f}",
            f"{score:.2f}",
        )

    console.print(table)
    console.print(f"[bold]Selected span:[/] {span}")
