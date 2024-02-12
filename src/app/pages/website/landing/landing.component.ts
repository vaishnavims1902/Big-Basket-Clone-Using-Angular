import { CommonModule } from '@angular/common';
import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { LoginService } from '../../../services/login/login.service';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  @ViewChild('loginFrm') loginFrm!: NgForm;
  @ViewChild('registerFrm') registerFrm!: NgForm;
  productList: any = [];
  categoryList: any = [];
  cartList: any= [];
  loginObj: loginObject = new loginObject();
  registerObj: registerObject = new registerObject();
  loggedInObj: any = {};
  profileObj: userProfileObject = new userProfileObject();
  showLoginPassword: boolean = false;
  showRegisterPassword: boolean = false;
  showProfilePassword: boolean = false;
  isApiCallInProgress: boolean = false;
  phonePattern: string = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
constructor(private prodSrv: ProductService, private router: Router, private loginSrv: LoginService) {
  const localData = localStorage.getItem('bigBasket_user');
  if (localData !== null) {
    this.loggedInObj = JSON.parse(localData);
    this.getCartByCustomerId(this.loggedInObj.custId);
  }
  this.prodSrv.cartUpdated$.subscribe((res: any) => {
    if (res) {
      this.getCartByCustomerId(this.loggedInObj.custId);
    }
  });
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategory();
  }

  navigateToProducts(id: number) {
    this.router.navigate(['/products', id]);
  }

  remove(cartId: number) {
    this.prodSrv.removeProductByCartId(cartId).subscribe((res: any) => {
      this.getCartByCustomerId(this.loggedInObj.custId);
    });
  }

  getCartByCustomerId(custId: number) {
    this.prodSrv.getCartDataByCustId(custId).subscribe((res: any) => {
      this.cartList = res;
    });
  }

  getAllProducts() {
    this.prodSrv.getProducts().subscribe((res) => {
      this.productList = res;
    })
  }
  getCustomerByCustomerId() {
    this.prodSrv.getCustomerById(this.loggedInObj.custId).subscribe((res: any) => {
      if (res.result) {
        this.profileObj = res.data;
      }
    });
  }


  

  updateProfile() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.prodSrv.updateProfile(this.profileObj).subscribe((res: any) => {
        if (res.result) {
          this.isApiCallInProgress = false;
          alert(res.message);
          this.closeProfileModal();
        } else {
          this.isApiCallInProgress = false;
          alert(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        alert(err.message);
      });
    }
  }

  openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
    this.getCustomerByCustomerId();
  }

  closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
      document.body.classList.remove('modal-open');
    }
    this.showProfilePassword = false;
  }

  openLoginModal() {
    const notNull = document.getElementById('loginModal');
    if (notNull != null) {
      notNull.style.display = 'block';
    }
    this.loginFrm.resetForm();
  }

  closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
      document.body.classList.remove('modal-open');
    }
    this.resetLoginModal();
  }

  openRegisterModal() {
    const notNull = document.getElementById('registerModal');
    if (notNull != null) {
      notNull.style.display = 'block';
    }
    this.registerFrm.resetForm();
  }

  closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
      document.body.classList.remove('modal-open');
    }
    this.resetRegisterModal();
  }

  register(registerFrm: NgForm) {
    if (registerFrm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        debugger;
        this.loginSrv.registerCustomer(this.registerObj).subscribe((res: any) => {
          if (res.result) {
            this.isApiCallInProgress = false;
            this.loggedInObj = res.data;
            alert(res.message);
            this.closeRegisterModal()
          } else {
            this.isApiCallInProgress = false;
          }
        }, (err: any) => {
          this.isApiCallInProgress = false;
        });
      }
    } else {
      Object.values(registerFrm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  login(loginFrm: NgForm) {
    if (loginFrm.valid) {
      if (!this.isApiCallInProgress) {
        this.isApiCallInProgress = true;
        this.loginSrv.login(this.loginObj).subscribe((res: any) => {
          if (res.result) {
            this.isApiCallInProgress = false;
            this.loggedInObj = res.data;
            sessionStorage.setItem('bigBasket_user', JSON.stringify(this.loggedInObj));
            this.closeLoginModal();
            this.getCartByCustomerId(this.loggedInObj.custId);
          } else {
            this.isApiCallInProgress = false;
          }
        }, (err: any) => {
          this.isApiCallInProgress = false;
        });
      }
    } else {
      Object.values(loginFrm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  resetLoginModal() {
    this.loginObj = new loginObject();
  }

  resetRegisterModal() {
    this.registerObj = new registerObject();
  }

  onLogOut() {
    const isConfirm = confirm('Are you sure that you wan to log out?');
    if (isConfirm) {
      localStorage.removeItem('bigBasket_user');
      this.loggedInObj = {};
      this.router.navigateByUrl('Allproducts');
      alert('Logged Out Successfully!!');
    }
  }

  onEyeClick() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  onRegisterEyeClick() {
    this.showRegisterPassword = !this.showRegisterPassword;
  }
  onProfileEyeClick() {
    this.showProfilePassword = !this.showProfilePassword;
  }
  calculateTotalSubtotal() {
    let totalSubtotal = 0;
    for (const item of this.cartList) {
      totalSubtotal += item.productPrice;
    }
    return totalSubtotal;
  }

  getAllCategory() {
    this.prodSrv.getCategory().subscribe((res: any) => {
      // Get top-level categories (parentCategoryId = 0)
      this.categoryList = res;
    });
  }
  // getAllCategory() {
  //   this.prodSrv.getCategory().subscribe((res) => {
  //     this.categoryList = res.filter((list: any) => list.parentCategoryId === 0);
  //   });
  // }

  loadSubcategories(parentCategory: any) {
    // Reset subcategories for all other parent categories
    this.categoryList.forEach((category: any) => {
      if (category !== parentCategory) {
        category.subcategories = undefined;
      }
    });
    // Fetch subcategories for the given parentCategoryId
    if (!parentCategory.subcategories) {
      setTimeout(() => {
        this.prodSrv.getCategory().subscribe((res: any) => {
          const subcategories = res.data.filter((list: any) => list.parentCategoryId === parentCategory.categoryId);
          // Update the corresponding parent category with subcategories
          parentCategory.subcategories = subcategories;
          // console.log(subcategories);
        });
      }, 100);
    }
  }

  resetSubcategories() {
    // Reset subcategories for all parent categories
    this.categoryList.forEach((category: any) => {
      category.subcategories = undefined;
    });
  }

  openOrders() { }
}
export class loginObject {
  mobile: any;
  password: any;

  constructor() {
    this.mobile = '';
    this.password = '';
  }
}

export class registerObject {
  custId: number;
  name: string;
  mobile: string;
  password: string;

  constructor() {
    this.custId = 0;
    this.name = '';
    this.mobile = '';
    this.password = '';
  }
}
  export class userProfileObject {
    custId: number;
    name: string;
    mobileNo: string;
    password: string;
  
    constructor() {
      this.custId = 0;
      this.name = '';
      this.mobileNo = '';
      this.password = '';
    }
}