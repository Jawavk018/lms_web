import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/providers/token-storage.service';


@Component({
  selector: 'app-homeonemain',
  templateUrl: './homeonemain.component.html',
  styleUrls: ['./homeonemain.component.scss'],
  
})
export class HomeonemainComponent implements OnInit {
  appUser: any = this.tokenStorage.getUser();


  constructor(private tokenStorage:TokenStorageService
    ) { 
  }

  ngOnInit(): void {
  }

}
