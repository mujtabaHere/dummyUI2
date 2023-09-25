import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'dummyUITask';
  baseURL='';
  displayedColumns: string[] = [ 'itemName', 'itemSellingPrice', 'itemBuyingPrice', 'itemStatus', 'action'];
  dataSource = [];
  loginForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.loadData();
    console.log('dataSource: ', this.dataSource);
    this.loginForm = this.formBuilder.group({
      itemId: [null],
      itemName: [null],
      itemSellingPrice: [null],
      itemBuyingPrice: [null],
      itemStatus:['available']
    });
  }

  deleteItem(id: number)
  {
    console.log('delete ', id);
    this.deleteData(id)
      .subscribe(response => {
        console.log(response);
        this.loadData();
      })
  }

  editItem(item: any)
  {
    this.loginForm.reset();
    console.log('edit ', item);
    this.loginForm.patchValue({
      itemId: item.itemId,
      itemName:item.itemName,
      itemSellingPrice:item.itemSellingPrice,
      itemBuyingPrice:item.itemBuyingPrice
    });

    console.log('editItem', this.loginForm.value);
    this.editData(this.loginForm.value)
      .subscribe(response => {
        console.log(response);
        this.loginForm.reset();
        this.loadData();

      })
  }

  loadData()
  {
    this.dataSource=[];
    fetch(this.baseURL)
      .then(response => response.json())
      .then(data => {
        console.log('data ', data);
        this.dataSource = data.data;
      }, error => {
        console.log(error);
      }); 
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    console.log('submit()', this.loginForm.value);
    this.postData(this.loginForm.value)
      .subscribe(response => {
        console.log(response)
        this.loginForm.reset();
        this.loadData();
      })
  }
  
    //api calls  
    postData(data: any): Observable<any> {
        return this.http.post(`${this.baseURL}/post`, data)
    }

    editData(data: any): Observable<any> {
      return this.http.put(`${this.baseURL}/item/${data.itemId}`, data)
    }

    deleteData(data: any): Observable<any> {
      return this.http.delete(`${this.baseURL}/item/${data}`)
    }

}
