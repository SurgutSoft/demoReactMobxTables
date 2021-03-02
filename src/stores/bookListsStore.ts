import {action, makeAutoObservable} from 'mobx';
import {listType, newBookList} from '../constants/BookLists';
import {IBookListFilters, IBookLists} from '../intarfaces/IBookLists';
import {getBookLists, createBookList, deleteBookList, updateBookList} from "../utils/api";

class BookListsStore {
  constructor() {
    makeAutoObservable(this)
  }

  isLoading = false;
  isLoadingEdit = false;
  data: Array<IBookLists> = [];
  editingData: Array<IBookLists> = [];
  tempBookList: IBookLists = {...newBookList};
  filters: IBookListFilters = {type: listType[0]};
  idEditingRow = -1;

  @action
  handleChangeTypeList = (type: string) => {
    console.log(type);
    this.filters = {...this.filters, type};
    this.fetchBookLists();
  }

  @action
  handleChangeStatus = (status: string) => {
    this.filters = {...this.filters, status: status !== 'any' ? status : undefined}
    this.fetchBookLists();
  }

  @action
  handleChangeGrade = (grade: string) => {
    if (grade !== 'Any') {
      let min;
      let maxGrade;
      if (grade.split("-").length === 2) {
      min = grade.split("-")[0].trim();
      maxGrade = +grade.split("-")[1].trim();
      } else {
        min = "12";
      }
      this.filters = {...this.filters, maxGrade, minGrade: min === 'PreK' ? -1 : +min}
    } else {
      this.filters = {...this.filters, maxGrade: undefined, minGrade: undefined}
    }

    this.fetchBookLists();
  };

  @action.bound
  onEdit = (row: IBookLists) => {
    this.idEditingRow = row.id;
    this.tempBookList = {...newBookList}
  }

  @action.bound
  handleEditingData = (value: string | number | undefined, row: IBookLists, key: keyof IBookLists) => {
    let minGrade;
    let maxGrade;
    if (key === 'minGrade') {
      switch (value?.toString().split("-")[0].trim()) {
        case "Any": {
          minGrade = -3;
          maxGrade = 12;
          break;
        }
        case "PreK": {
          minGrade = -1;
          maxGrade = 1;
          break;
        }
        case "12+": {
          minGrade = 12;
          maxGrade = 12;
          break;
        }
        default: {
          minGrade = value?.toString().split("-")[0].trim();
          maxGrade = value?.toString().split("-")[1].trim();
        }
      }
    }

    if (row.id !== this.tempBookList.id) {
      const index = this.editingData.findIndex(i => i.id === row.id);
      if (key !== 'minGrade') {
        // @ts-ignore
        this.editingData[index][key] = value;
      } else {
        debugger;
        this.editingData[index].minGrade = +(minGrade || -1)
        this.editingData[index].maxGrade = +(maxGrade || 12)
      }
    } else {
      // @ts-ignore
      this.tempBookList[key] = value;
    }
  };

  @action
  createNewBookList = () => {
    this.data.unshift(this.tempBookList);
    this.idEditingRow = newBookList.id;
  };

  @action
  onCancelEditing = (row: IBookLists) => {
    if (row.id !== this.tempBookList.id) {

    } else {
      this.data.shift();
    }

    this.idEditingRow = -1;
  };

  @action.bound
  onSave = (row: IBookLists) => {
    const editingRow = this.editingData.find(item => item.id === row.id);
    const index = this.data.findIndex(item => item.id === row.id);
    //@ts-ignore
    this.data[index] = row.id !== this.tempBookList.id ? {...editingRow} : {...this.tempBookList};

    this.isLoadingEdit = true;
    row.id !== this.tempBookList.id && editingRow ? this.onUpdate(editingRow) : this.onCreate();
  }

  @action
  onUpdate = async (editingRow: IBookLists) => {
    await updateBookList(editingRow);
    this.isLoadingEdit = false;
    this.idEditingRow = -1;
    this.fetchBookLists();
  };

  @action
  onCreate = async () => {
    await createBookList(this.tempBookList);
    this.isLoadingEdit = false;
    this.idEditingRow = -1;
    this.fetchBookLists();
  };

  @action.bound
  onDelete = async (id: number) => {
    deleteBookList(id);
    this.fetchBookLists();
  }

  @action.bound
  fetchBookLists = async () => {
    const params = this.filters;

    this.isLoading = true;
    const data = await getBookLists(params);
    this.data = data;
    this.editingData = data;
    this.isLoading = false;
  }
};

export default new BookListsStore();
