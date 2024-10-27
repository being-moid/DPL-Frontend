import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/model';
import { ApiService } from '../../services/ApiService.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  showModal = false;
  private fb: FormBuilder = inject(FormBuilder);
  categoryForm: FormGroup= this.fb.group({
    categoryName: [''],
    description: [''],
    image: [null]
  });
  isEditMode = false;

  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.apiService.getCategories().subscribe(
      res=>{
        this.categories=res;
      }
    );
  }

  openModal(category?: Category) {
    this.isEditMode = !!category;
    if (category) {
      this.categoryForm.patchValue(category);
    } else {
      this.categoryForm.reset();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('CategoryName', this.categoryForm.controls['categoryName'].value);
    formData.append('Description', this.categoryForm.controls['categoryName'].value);
   // Append the file if it exists
   if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

    if (this.isEditMode) {
      // Call the update API
      // this.apiService.updateCategory(this.categoryForm.value.id, formData).subscribe(() => {
      //   this.fetchCategories();
      //   this.closeModal();
      // });
    } else {
      // Call the create API
      const formData = new FormData();
      formData.append('CategoryName', this.categoryForm.controls['categoryName'].value);
      formData.append('Description', this.categoryForm.controls['categoryName'].value);
     // Append the file if it exists
     if (this.selectedFile) {
      formData.append('image', this.selectedFile);
     }
      this.apiService.createCategory(formData).subscribe(() => {
        this.fetchCategories();
        this.closeModal();
      });
    }
  }
  selectedFile: File | null = null;
  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    } else {
      this.selectedFile = null;
    }
  }
}
