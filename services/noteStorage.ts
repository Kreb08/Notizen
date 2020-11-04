import Datastore from "nedb-promises-ts";

export class Note {
  title: string;
  description: string;
  importance: number;
  endDate: Date;

  constructor(
    title: string,
    description: string,
    importance: number,
    endDate: Date
  ) {
    this.title = title;
    this.description = description;
    this.importance = importance;
    this.endDate = endDate;
  }
}

export class NoteStore {
  private db: Datastore<any>;

  constructor(db?: Datastore<any>) {
    this.db =
      db || new Datastore({ filename: "./data/notes.db", autoload: true });
  }

  async add(
    title: string,
    description: string,
    importance: number,
    endDate: Date
  ) {
    let note = new Note(title, description, importance, endDate);
    return await this.db.insert(note);
  }

  async updateNote(id: string, note: Note) {
    await this.db.update(
      { _id: id },
      {
        $set: {
          title: note.title,
          description: note.description,
          importance: note.importance,
          endDate: note.endDate,
        },
      }
    );
    return await this.get(id);
  }

  async get(id: string) {
    return this.db.findOne({ _id: id });
  }

  async all() {
    return this.db.find({});
  }
}

export const noteStore = new NoteStore();
