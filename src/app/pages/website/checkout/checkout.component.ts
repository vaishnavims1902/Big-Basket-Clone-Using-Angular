import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  loggedInObj: any = {};
  cartItem: any[] = [];
  placeOrderObj: placeOrderObject = new placeOrderObject();
  isApiCallInProgress: boolean = false;

  constructor(private prodSrv: ProductService, private router: Router) {
    const localData = sessionStorage.getItem('bigBasket_user');
    if (localData !== null) {
      const parseObj = JSON.parse(localData);
      this.loggedInObj = parseObj;
      this.getCartByCustomerId(this.loggedInObj.custId);
    }
    this.prodSrv.cartUpdated$.subscribe((res: any) => {
      if (res) {
        this.getCartByCustomerId(this.loggedInObj.custId);
      }
    });
  }

  ngOnInit(): void {
  }

  getCartByCustomerId(custId: number) {
    this.prodSrv.getCartDataByCustId(custId).subscribe((res: any) => {
      this.cartItem = res;
      if (!this.cartItem || this.cartItem.length === 0) {
        this.router.navigate(['/Allproducts']);
      }
    });
  }

  placeCartOrder(placeOrderFrm: NgForm) {
    if (placeOrderFrm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        this.placeOrderObj.customer = {"custId" :this.loggedInObj.custId};
        this.placeOrderObj.totalInvoiceAmount = this.calculateTotalSubtotal();
        this.prodSrv.placeOrder(this.placeOrderObj).subscribe((res: any) => {
          if (res) {
            this.isApiCallInProgress = false;
            alert("Your order has been placed successfully!");
            this.prodSrv.cartUpdated$.next(true);
            this.placeOrderObj = new placeOrderObject();
            this.router.navigateByUrl('Allproducts');
          } else {
            this.isApiCallInProgress = false;
            alert( "Something went wrong! Please try again later.");
          }
        }, (err: any) => {
          this.isApiCallInProgress = false;
          alert(err.message);
        });
      }
    } else {
      Object.values(placeOrderFrm.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
  }

  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    for (const item of this.cartItem) {
      totalSubtotal += (item.productPrice * item.quantity);
    }
    return totalSubtotal;
  }

  deleteProductFromCartById(cartId: number) {
    this.prodSrv.removeProductByCartId(cartId).subscribe((res: any) => {
      this.prodSrv.cartUpdated$.next(true);
      this.getCartByCustomerId(this.loggedInObj.custId);
    });
  }
}

export class placeOrderObject {
  saleId: number;
  customer: object;
  saleDate: Date;
  totalInvoiceAmount: number;
  discount: number;
  paymentNaration: string;
  deliveryAddress1: string;
  deliveryAddress2: string;
  deliveryCity: string;
  deliveryPinCode: string;
  deliveryLandMark: string;

  constructor() {
    this.saleId = 0;
    this.customer = {  "custId": 0 };
    this.saleDate = new Date();
    this.totalInvoiceAmount = 0;
    this.discount = 0;
    this.paymentNaration = '';
    this.deliveryAddress1 = '';
    this.deliveryAddress2 = '';
    this.deliveryCity = '';
    this.deliveryPinCode = '';
    this.deliveryLandMark = '';
  }
}
