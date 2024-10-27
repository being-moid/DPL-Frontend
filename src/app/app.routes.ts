import { Routes } from '@angular/router';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { DashboardComponent } from './portal/dashboard/dashboard.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { CategoryComponent } from './portal/category/category.component';
import { ProductsComponent } from './portal/products/products.component';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    children:[
    {
      path:'dashboard',
      component:DashboardComponent
    },
    {
      path:'category',
      component:CategoryComponent
    },
    {
      path:'products',
      component:ProductsComponent
    }
    ],

  },
  {
    path:'auth',
    component:AuthLayoutComponent,
    children:[
      {
        path:'sign-in',
        component:SignInComponent
      },
      {
        path:'sign-up',
        component:SignUpComponent
      }
    ]
  },  {
    path: '**',
    component: NotfoundComponent // Optional: 404 Not Found component
  }
];
