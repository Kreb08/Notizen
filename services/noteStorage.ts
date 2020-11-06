import Datastore from "nedb-promises";

export class Note {
  constructor(
    public title: string,
    public description: string,
    public importance: number,
    public endDate: Date,
    public finished: string
  ) {}
}

export class NoteStore {
  private db: Datastore;

  constructor(db?: Datastore) {
    this.db =
      db ||
      new Datastore({
        filename: "./data/notes.db",
        autoload: true,
        timestampData: true,
      });
  }

  async add(
    title: string,
    description: string,
    importance: number,
    endDate: Date,
    finished: string
  ) {
    if (finished === undefined) {
      finished = "off";
    }
    let note = new Note(title, description, importance, endDate, finished);
    return await this.db.insert(note);
  }

  async updateNote(id: string, note: Note) {
    if (note.finished === undefined) {
      note.finished = "off";
    }
    await this.db.update(
      { _id: id },
      {
        $set: {
          title: note.title,
          description: note.description,
          importance: note.importance,
          endDate: note.endDate,
          finished: note.finished,
        },
      }
    );
    return await this.get(id);
  }

  async get(id: string) {
    return this.db.findOne({ _id: id });
  }

  async all(orderBy: string, orderDirection: number, filter: string) {
    let filterQuery;
    if (filter === "off") {
      filterQuery = {};
    } else {
      filterQuery = { finished: "off" };
    }
    let sortQuery;
    switch (orderBy) {
      case "importance":
        sortQuery = { importance: -orderDirection };
        break;
      case "createDate":
        sortQuery = { createdAt: orderDirection };
        break;
      default:
      case "finishDate":
        sortQuery = { endDate: orderDirection };
        break;
    }
    return this.db.find(filterQuery).sort(sortQuery);
  }
}

export const noteStore = new NoteStore();
