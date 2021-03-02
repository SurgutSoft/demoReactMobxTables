import {message} from 'antd';
import {action, computed, makeAutoObservable} from 'mobx';
import {newTempAchiement} from '../constants/Achievements';
import {IAchievements, IAchievementsFilters} from '../intarfaces/IAchievements';
import {
  createAchievements,
  updateAchievements,
  getAchievements,
  uploadAchImage,
  deleteAch,
  moveAchievementTop,
  moveAchievementEnd
} from "../utils/api";

class AchievementsStore {
  constructor() {
    makeAutoObservable(this)
  }

  isLoading = false;
  isLoadingImage = false;
  isLoadingCreateNewAch = false;
  totalData: Array<IAchievements> = [];
  tempAchiement: IAchievements = {...newTempAchiement};
  editingData: Array<IAchievements> = [];
  filters: IAchievementsFilters = {};
  idEditingRow = -1;

  @computed
  get filteredData() {
    const {country, type} = this.filters;
    return this.totalData.filter(item => (type ? item.goalType === type : true) && (country ? item.country === country : true))
  }

  @action.bound
  handleChangeType = (type: string) => {
    this.filters = {...this.filters, type: type.includes('Any') ? undefined : type}
  }

  @action.bound
  handleChangeRegion = (country: string) => {
    this.filters = {...this.filters, country: country.includes('Any') ? undefined : country}
  }

  @action.bound
  toggleEditing = (row: IAchievements) => {
    this.idEditingRow = row.id;
    this.tempAchiement = {...newTempAchiement}
  }

  @action.bound
  toggleCancelEditing = (row: IAchievements) => {
    if (row.id !== this.tempAchiement.id) {
      const key = this.totalData.findIndex(item => item.id === row.id);
      // @ts-ignore
      this.filteredData[key] = {...this.totalData.find(i => i.id === row.id)};
    } else {
      this.totalData.shift();
    }
    this.idEditingRow = -1;
  }

  @action.bound
  setIdEditingRow = (id: number) => {
    this.idEditingRow = id
  }

  @action.bound
  handleEditingData = (value: string | number | undefined, row: IAchievements, key: keyof IAchievements) => {
    if (value === 'Any') value = undefined;
    if (row.id !== this.tempAchiement.id) {
      const index = this.editingData.findIndex(i => i.id === row.id);
      // @ts-ignore
      this.editingData[index][key] = value;
    } else {
      // @ts-ignore
      this.tempAchiement[key] = value;
    }
  }

  @action.bound
  onSave = (row: IAchievements) => {
    const editingRow = this.editingData.find(item => item.id === row.id);
    const index = this.totalData.findIndex(item => item.id === row.id);
    // @ts-ignore
    this.totalData[index] = row.id !== this.tempAchiement.id ? {...editingRow} : {...this.tempAchiement};

    this.isLoadingCreateNewAch = true;

    row.id !== this.tempAchiement.id ? this.onUpdate(row, editingRow) : this.onCreate();
  }


  onCreate = async () => {
    const {imageUrl, goalText, doneText, name} = this.tempAchiement;
    if (!imageUrl || !goalText || !doneText || !name) {
      message.info("fill in the required fields (image, name, goal & done text)");
      this.idEditingRow = this.tempAchiement.id;
    } else {
      const newRow: Array<IAchievements> = await createAchievements(this.tempAchiement);
      this.totalData = newRow;
      this.editingData = newRow;
      this.idEditingRow = -1;
      this.tempAchiement = {...newTempAchiement};
    }
    this.isLoadingCreateNewAch = false;
  }

  onUpdate = async (row: IAchievements, editingRow?: IAchievements) => {
    try {
      await updateAchievements(row, editingRow);
    } catch (e) {
      message.error(`Update was failed`);
    }
    this.isLoadingCreateNewAch = false;
    this.idEditingRow = -1;
  }

  moveTop = async (id: number) => {
    this.isLoading = true;
    await moveAchievementTop(id);
    await this.fetchAchievements();
  }

  moveEnd = async (id: number) => {
    this.isLoading = true;
    await moveAchievementEnd(id);
    await this.fetchAchievements();
  }

  @action.bound
  fetchAchievements = async () => {
    this.isLoading = true;
    const data = await getAchievements();
    this.totalData = data;
    this.editingData = data;
    this.isLoading = false;
  }

  @action.bound
  uploadImage = async (file: any, row: IAchievements) => {
    this.isLoadingImage = true;
    try {
      const newImageUrl = await uploadAchImage(file);
      this.handleEditingData(newImageUrl.imageUrl, row, 'imageUrl');
      message.success(`${file.name} file uploaded successfully`);
    } catch (e) {
      message.error(`${file.name} file upload failed.`);
    }
    this.isLoadingImage = false;
  };

  @action.bound
  createNewAch = async () => {
    this.isLoadingCreateNewAch = true;
    this.idEditingRow = this.tempAchiement.id;
    this.totalData.unshift(this.tempAchiement);
    this.isLoadingCreateNewAch = false;
  };

  @action.bound
  deleteAch = (id: number) => {
    deleteAch(id);
    this.totalData = this.totalData.filter(item => item.id !== id);
  }
}

export default new AchievementsStore();
