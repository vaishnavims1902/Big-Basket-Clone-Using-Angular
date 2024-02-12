import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../services/login/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  searchTxt: string = '';

  constructor(private loginSrv: LoginService){}

  onFilter(event:any){
    debugger
    this.loginSrv.searchBox.next(event);
  }
}
