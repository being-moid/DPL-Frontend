import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Product } from '../../models/model';
import { ApiService } from '../../services/ApiService.service';
import { CommonModule, CurrencyPipe, JsonPipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule,CurrencyPipe,JsonPipe],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isModalOpen = false;
  productForm: FormGroup;
  editingProduct: Product | null = null;
  categories$: Observable<Category[]> = of([]);
  constructor(private apiService: ApiService,
    private fb: FormBuilder) {
    // Initialize the reactive form
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      image: [null], // For handling file input
      categoryId: ['', Validators.required],
      categoryName:['']
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Fetch products from the API
    this.apiService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  openModal(product?: Product) {
    this.isModalOpen = true;
    this.editingProduct = product || null;

    if (product) {
      // If editing, populate the form with the product's details
      this.productForm.patchValue({
        productName: product.productName,
        amount: product.amount,
        categoryId: product.categoryId,

      });
    } else {
      // If adding a new product, reset the form
      this.productForm.reset();
    }
  }
  isActive=false;
  closeModal() {
    this.isModalOpen = false;
    this.editingProduct = null;
    this.productForm.reset();
  }
  selectedFile: File | null = null;
  submitForm() {
    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();
    const productData = this.productForm.value as Product;

    // Append form data
    formData.append('product', JSON.stringify(productData));

    if (this.editingProduct) {
      // Update existing product
      this.apiService.createProduct(productData,this.selectedFile as File).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    } else {
      // Create new product
      this.apiService.createProduct(productData,this.selectedFile as File ).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    }
  }
   displayFn(id:string):string{
     return this.cat.find(x=>x.categoryId)?.categoryName || "null";
  }
  cat:Category[]=[];
  setupCategoryAutocomplete() {
    this.isActive=false;
    this.productForm.get('categoryName')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value: string) =>
          value ? this.apiService.getCategoriesAutocomplete(value) : of([])
        ),
        catchError(() => of([])) // Handle errors gracefully
      )
      .subscribe((categories) => {
        this.categories$ = of(categories);
        this.cat=categories;
      });
  }
  selectCategory(category: Category) {
    this.isActive=true;
    this.productForm.patchValue({
      categoryId: category.categoryId, // Set the ID in the form
      categoryName: category.categoryName, // Set the name for display
    });
  }
  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    } else {
      this.selectedFile = null;
    }
  }
}
