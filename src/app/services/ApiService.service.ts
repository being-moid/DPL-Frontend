import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../enviornment/enviornment.development';
import { Category, Product } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.BASE_URL+'api'; // Adjust this URL according to your setup

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/category`);
  }

  createCategory(formData:FormData): Observable<Category> {


    return this.http.post<Category>(`${this.baseUrl}/category`, formData);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/product`);
  }

  createProduct(product: Product, image: File): Observable<Product> {
    const formData = new FormData();
    formData.append('ProductName',product.productName);
    formData.append('Amount',product.amount.toString());
    formData.append('CategoryId',product.categoryId);
    formData.append('Image', image);

    return this.http.post<Product>(`${this.baseUrl}/product`, formData);
  }
  // New autocomplete method for categories
  getCategoriesAutocomplete(term: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/category/autocomplete?prefix=${term}`);
  }
}
