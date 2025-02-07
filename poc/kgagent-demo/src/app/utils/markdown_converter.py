from enum import Enum

import mistune


class ElementPrecedence(Enum):
    H1 = 7
    H2 = 6
    H3 = 5
    H4 = 4
    H5 = 3
    H6 = 2
    LIST = 1
    LIST_ITEM = 0


class Tree:
    def __init__(self):
        self.nodes = []
        self.current_parent = None


class TreeNode:
    def __init__(self, element):
        self._set_precedence(element)

    def set_text(self, text):
        self.text = text

    def _set_precedence(self, element):
        if element["type"] == "heading":
            level = element["attrs"].get("level", -1)
            if level < 7:
                self.precedence = ElementPrecedence[f"H{level}"].value
            else:
                self.precedence = ElementPrecedence[f"H{level}"].value
        elif element["type"] == "list":
            self.precedence = ElementPrecedence.LIST.value
        elif element["type"] == "list_item":
            self.precedence = ElementPrecedence.LIST_ITEM.value
        else:
            raise ValueError("Invalid element type in markdown")

    def __str__(self):
        return self.text


class MarkdownConverter:

    def __init__(self):
        self.data = {"nodes": [], "relationships": []}

    def add_to_tree(self, tree, node):
        if not tree.nodes:
            tree.nodes.append(node)
            return
        last_node = tree.nodes[-1]
        while tree.nodes and last_node.precedence <= node.precedence:
            removed_node = tree.nodes.pop()
            if not tree.nodes:
                tree.nodes.append(node)
                break
            last_node = tree.nodes[-1]
            self.data["relationships"].append(
                {"source": last_node.text, "destination": removed_node.text}
            )
        tree.nodes.append(node)

    def build_from_list(self, tree, element, parent_node):
        for child in element["children"]:
            child_node = TreeNode(child)
            child_node.set_text(child["children"][0]["children"][0]["raw"])
            self.data["nodes"].append({"description": child_node.text})
            self.data["relationships"].append(
                {"source": parent_node.text, "destination": child_node.text}
            )
            if len(child["children"]) > 1:
                self.build_from_list(tree, child["children"][1], child_node)

    def process_markdown(self, md_text):
        markdown = mistune.create_markdown(renderer="ast")
        ast = markdown(md_text)
        tree = Tree()
        for element in ast:
            if element["type"] == "blank_line":
                continue
            node = TreeNode(element)
            if not tree.current_parent:
                node.set_text(element["children"][0]["raw"])
                self.data["nodes"].append({"description": node.text})
                tree.current_parent = node
            else:
                if element["type"] == "list":
                    self.build_from_list(tree, element, tree.current_parent)
                elif element["type"] == "heading":
                    node.set_text(element["children"][0]["raw"])
                    self.data["nodes"].append({"description": node.text})
                    self.add_to_tree(tree, tree.current_parent)
                    tree.current_parent = node
        if tree.current_parent:
            self.add_to_tree(tree, tree.current_parent)

        while tree.nodes:
            removed_node = tree.nodes.pop()
            if not tree.nodes:
                break
            last_node = tree.nodes[-1]
            self.data["relationships"].append(
                {"source": last_node.text, "destination": removed_node.text}
            )
        return self.data
