import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { Sidebar } from '../../sidebar/sidebar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, DatePipe, Sidebar, RouterLinkWithHref],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {


  currentDate : Date = new Date();
}
