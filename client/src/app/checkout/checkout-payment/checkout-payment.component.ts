import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  constructor(private basketService: BasketService, private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
  }

  submitOrder() {
    console.log('Order submit');

    const basket = this.basketService.getCurrentBasketValue();

    console.log(basket);

    const orderToCreate = this.getOrderToCreate(basket);

    console.log(orderToCreate);

    this.checkoutService.createOrder(orderToCreate).subscribe((order: IOrder) => {
      this.toastr.success('Order created');
      this.basketService.deleteLocalBasket(basket.id);
      const navExtras: NavigationExtras = {state: order};
      this.router.navigate(['checkout/success'], navExtras);

    },
    error => {
      this.toastr.error(error.message);
      console.log(error);
    });
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }
}