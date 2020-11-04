import { noteStore } from "../services/noteStorage";

export class NotesController {
  async showIndex(req: any, res: any): Promise<void> {
    let notes = await noteStore.all();
    res.render("index", { notes: notes });
  }

  createNote(req: any, res: any) {
    res.render("note", { title: "Notiz anlegen:", url: req.url, note: {} });
  }

  async addNote(req: any, res: any) {
    let note = await noteStore.add(
      req.body.title,
      req.body.description,
      req.body.importance,
      req.body.endDate
    );
    console.log("Created:");
    console.log(note);
    res.redirect("/");
  }

  async editNote(req: any, res: any) {
    let note = await noteStore.get(req.params.id);
    console.log("Editing:");
    console.log(note);
    await res.render("note", {
      title: "Notiz editieren",
      url: req.url,
      note: await noteStore.get(req.params.id),
    });
  }

  async updateNote(req: any, res: any) {
    await noteStore.updateNote(req.params.id, req.body);
    console.log("Updated: " + req.params.id);
    res.redirect("/");
  }
}

export const noteController = new NotesController();
