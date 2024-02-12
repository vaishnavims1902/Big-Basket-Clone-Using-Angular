import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../../services/login/login.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,TruncatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  isSidePanelVisible: boolean= false;
  productObj: any = {
    "productId": 0,
    "productSku": "",
    "productName": "",
    "productPrice": 0,
    "productShortName": "",
    "productDescription": "",
    "createdDate": new Date(),
    "deliveryTimeSpan": "",
    "categoryId": 0,
    "productImageUrl": ""
  };
  categoryList: any = [];
  productsList: any= [];
  filteredProductsList: any[] = [];
  isApiCallInProgress: boolean = false;

  constructor(private productSrv: ProductService, private loginSrv: LoginService) {
    this.loginSrv.searchBox.subscribe((res:string)=>{
      this.filteredProductsList = this.productsList.filter((product:any)=>{
        return Object.values(product).some((val:any)=>{
          return val.toString().toLowerCase().includes(res.toLowerCase());
        });
      })
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.getAllCategory();
  }

  getProducts() {
    this.productSrv.getProducts().subscribe((res: any) => {
      this.productsList = res;
      this.filteredProductsList = res;
    });
  }

  getAllCategory() {
    this.productSrv.getCategory().subscribe((res: any) => {
      this.categoryList = res;
    });
  }

  onSave() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productSrv.saveProduct(this.productObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          alert("Product Created Successfully");
          this.getProducts();
          this.closeSidePanel();
        } else {
          this.isApiCallInProgress = false;
          alert("Not Store");
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        alert(err.message);
      });
    }

  }

  onUpdate() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productSrv.updateProduct(this.productObj).subscribe((res: any) => {
        if (res) {
          this.isApiCallInProgress = false;
          alert("Product Updated Successfully");
          this.getProducts();
          this.closeSidePanel();
        } else {
          this.isApiCallInProgress = false;
          alert("Not update");
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        alert(err.message);
      });
    }

  }

  onDelete(item: any) {
    const isDelete = confirm('Are you Sure want to delete?');
    if (isDelete) {
      this.productSrv.deleteProduct(item.productId).subscribe((res: any) => {
        if (res) {
          alert("Product Deleted Successfully");
          this.getProducts();
        } else {
          alert("Not Deleted");
        }
      });
    }
  }

  onEdit(item: any) {
    this.productObj = item;
    this.openSidePanel();
  }

  openSidePanel() {
    this.isSidePanelVisible = true;
  }

  closeSidePanel() {
    this.isSidePanelVisible = false;
    this.onReset();
  }

  onReset() {
    this.productObj = {
      "productId": 0,
      "productSku": "",
      "productName": "",
      "productPrice": 0,
      "productShortName": "",
      "productDescription": "",
      "createdDate": new Date(),
      "deliveryTimeSpan": "",
      "categoryId": 0,
      "productImageUrl": ""
    };
  }

}




  // constructor(private productSrv: ProductService) {
    
  // }
  // ngOnInit(): void {
  //   this.getProducts();
  //   this.getALlCategory();
  // }
  // getProducts() {
  //   this.productSrv.getProducts().subscribe((res)=>{
  //     this.productsList = res;
  //   })
  // }
  // getALlCategory() {
  //   this.productSrv.getCategory().subscribe((res)=>{
  //     this.categoryList = res;
  //   })
  // }
  // onUpdate() {
  //   this.productSrv.saveProduct(this.productObj).subscribe((res)=>{
  //     debugger;
  //     if(res) {
  //       alert("Product Updated");
  //       this.getProducts();
  //     } else {
  //       alert("Not Updated")
  //     }
  //   })
  // }
  // onSave() {
  //   this.productSrv.saveProduct(this.productObj).subscribe((res)=>{
  //     debugger;
  //     this.getProducts();
  //     if(res) {
  //       alert("Product Created");
  //       this.getProducts();
  //     } else {
  //       alert("Not Store")
  //     }
  //   })
  // }
  // onDelete(item: any) {
  //   const isDelete = confirm('Are you Sure want to delte');
  //   if(isDelete) {
  //     this.productSrv.deleteProduct(item.productId).subscribe((res)=>{
  //       debugger;
  //       if(res) {
  //         alert("Product Deleted");
  //         this.getProducts();
  //       } else {
  //         alert("Not Deleted")
  //       }
  //     })
  //   }
  // }

  // onEdit(item: any) {
  //   this.productObj = item;
  //   this.openSidePanel();
  // }


  // openSidePanel() {
  //   this.isSidePanelVisible = true;
  // }

  // closeSidePanel() {
  //   this.isSidePanelVisible = false;
  // }

  // onReset() {
  //   this.productObj = {
  //     "productId": 0,
  //     "productSku": "",
  //     "productName": "",
  //     "productPrice": 0,
  //     "productShortName": "",
  //     "productDescription": "",
  //     "createdDate": new Date(),
  //     "deliveryTimeSpan": "",
  //     "categoryId": 0,
  //     "productImageUrl": ""
  //   };
  // }
//}
