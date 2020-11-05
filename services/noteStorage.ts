import Datastore from "nedb-promises";

export class Note {
  constructor(
    public title: string,
    public description: string,
    public importance: number,
    public endDate: Date,
    public finished: string = "off"
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
