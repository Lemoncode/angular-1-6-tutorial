import * as model from '../../../api/model/client';
import * as vm from "./viewModel";


export class ClientListMapper {

  constructor() {  
    "ngInject";    
  }

  public ClientFromModelToVm(clientModel : model.Client ): vm.Client {
    return {
      ...clientModel
    }
  }

  public ClientListFromModelToVm(clientListModel : model.Client[]) : vm.Client[] {
    return clientListModel.map(this.ClientFromModelToVm);
  }
}
