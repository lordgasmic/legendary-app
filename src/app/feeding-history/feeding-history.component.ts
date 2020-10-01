import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FeedResponse } from '../models/FeedResponse';
import { LordgasmicService } from '../services/lordgasmic/lordgasmic.service';

@Component({
  selector: 'app-feeding-history',
  templateUrl: './feeding-history.component.html',
  styleUrls: ['./feeding-history.component.scss']
})
export class FeedingHistoryComponent implements OnInit {

  title = 'Feeding by milk type';
   type = 'ColumnChart';
   data = [];
   columnNames = ['Date', 'hmf', 'no hmf', 'bm+f', '22c', 'bm', 'bm+f+22c'];
   options = {   
      hAxis: {
         title: 'Date'
      },
      vAxis:{
         minValue:0
      },
      isStacked:true	  
   };
   width = 550;
   height = 400;

  constructor(private lordgasmicService: LordgasmicService) { }

  ngOnInit(): void {
    this.lordgasmicService.getFeeds().subscribe(feedResonse => {
       var date = '';
       var feeds = new Map<string, FeedResponse[]> ();
       feedResonse.forEach(feed => {
          var res: FeedResponse[];
          if (feeds.has(feed.date)) {
             res = feeds.get(feed.date);
          }
          else {
             res = [];
          }

          res.push(feed);

          feeds.set(feed.date, res);

       });

       // iterate map
       // add to data
       // data = [["x", y,y,y,y ],[]]
       feeds.forEach((value, key) => {
         var arr = [];
         arr.push(key)
         var types: Map<string, number> = new Map<string, number>();
         value.forEach(feed => {
            // bm vs formula
            // ttl qty per day
            // bottles per day
            // feeds per day
            // scatter cart of time of day
            feed.bottles.forEach(bottle => {
               var q = 0;
               if (types.get(bottle.note)){
                  var q = types.get(bottle.note);
                  q += bottle.quantity;
               }
               else{
                  q = bottle.quantity;	
               }
               types.set(bottle.note, q);
            });
         });

         // sort types
         // hmf, no hmf, bm+f, 22c, bm, bm+f+22c
         if (types.has("hmf")) {
            arr.push(types.get("hmf"));
         }
         else {
            arr.push(0);
         }
         if (types.has("no hmf")) {
            arr.push(types.get("no hmf"));
         }
         else {
            arr.push(0);
         }
         if (types.has("bm+f")) {
            arr.push(types.get("bm+f"));
         }
         else {
            arr.push(0);
         }
         if (types.has("22c")) {
            arr.push(types.get("22c"));
         }
         else {
            arr.push(0);
         }
         if (types.has("bm")) {
            arr.push(types.get("bm"));
         }
         else {
            arr.push(0);
         }
         if (types.has("bm+f+22c")) {
            arr.push(types.get("bm+f+22c"));
         }
         else {
            arr.push(0);
         }

         this.data.push(arr);
       });

       //this.data.sort((a,b) => a[0] - b[0]);
       //this.data.sort((a,b) => a[0].localeCompare(b[0]));

       this.data.sort(function(a,b) {
         var aComps = a[0].split("/");
         var bComps = b[0].split("/");
         var aDate = new Date(aComps[2], aComps[0], aComps[1]);
         var bDate = new Date(bComps[2], bComps[0], bComps[1]);
         return aDate.getTime() - bDate.getTime();
     });
    });
  }

}
