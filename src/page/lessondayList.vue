<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
        <el-button type="primary" @click="initData">获取订单信息</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
            <el-tab-pane label="全部订单" name="all"></el-tab-pane>
            <el-tab-pane label="未排课" name="nolessonday"></el-tab-pane>
            <el-tab-pane label="已排课" name="lessonday"></el-tab-pane>
            <el-tab-pane label="已授课完毕" name="teached"></el-tab-pane>
        </el-tabs>
        <!-- 显示订单表格 -->
        <div class="table_container" v-show="activeName!='tea'">
            <el-table
                :data="showtableData"
                :row-key="row => row.id"
                style="width: 100%">
                <el-table-column
                  label="科目"
                  prop="subject">
                </el-table-column>
                <el-table-column
                  label="教师姓"
                  prop="teacher.firstname">
                </el-table-column>
                <el-table-column
                  label="教师名"
                  prop="teacher.lastname">
                </el-table-column>
                <el-table-column
                  label="孩子简介"
                  prop="kid">
                </el-table-column>
                <el-table-column
                  label="已上课时"
                  prop="teachtimes">
                </el-table-column>
                <el-table-column
                  label="总课时"
                  prop="times">
                </el-table-column>
                <el-table-column
                  label="总价"
                  prop="value">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="success"
                        @click="dialogOpen(scope.row)"
                        v-show="scope.row.teachtimes < scope.row.times">
                        排课
                    </el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div> -->
        </div>
        <el-dialog
          title="排课"
          :visible.sync="dialogVisible"
          width="80%"
          :before-close="dialogClose">
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveDates">保存</el-button>
          </span>
          <el-tabs v-model="dialogactive" type="card" @tab-click="clickDialogTab">
              <el-tab-pane label="按周排课" name="week"></el-tab-pane>
              <el-tab-pane label="课表" name="list"></el-tab-pane>
          </el-tabs>
          <div class="table_container" v-show="dialogactive=='week'">
            <div>学生简介：{{dialogorder.kid}}</div>
            <div>科目：{{dialogorder.subject}}</div>
            <span>排课开始日期：</span>
            <el-date-picker
              v-model="startday"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div>排课课时：{{dialogorder.times}}</div>
            <div>
              <el-select v-model="selecteddates" placeholder="请选择星期几">
                <el-option
                  v-for="item in dates"
                  :key="item.value"
                  :label="item.label"
                  :value="item">
                </el-option>
              </el-select>
            </div>
            <el-time-select
              placeholder="起始时间"
              v-model="startTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00'
              }">
            </el-time-select>
            <el-time-select
              placeholder="结束时间"
              v-model="endTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00',
                minTime: startTime
              }">
            </el-time-select>
            <el-button @click="clickAddDates">添加时段</el-button>
            <div v-for="item in datesandtime">
              {{item.selecteddates.label + '，' + item.startTime + '~' + item.endTime}}
              <el-button
                  size="small"
                  type="danger"
                  @click="removeByValue(datesandtime, item)">
                  删除
              </el-button>
            </div>
            <div>
              <el-button @click="clickSetDates(dialogorder.times)" type="success">生成课表</el-button>
            </div>
          </div>
          <div class="table_container" v-show="dialogactive=='list'">
            <el-calendar>
              <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
              <template
                slot="dateCell"
                slot-scope="{date, data}">
                <p :class="data.isSelected ? 'is-selected' : ''">
                  {{ data.day.split('-').slice(1).join('-') }} {{ havethisday(data.day) ? '✔️' : ''}}
                </p>
              </template>
            </el-calendar>
          </div>
        </el-dialog>
    </div>
</template>

<script>
const axios = require("axios");
import headTop from "../components/headTop";

export default {
  data() {
    return {
      activeName: "all",
      offset: 0,
      limit: 20,
      count: 1,
      tableData: [],
      showtableData: [],
      currentPage: 1,
      headertoken: "",
      addday: "",
      addtime: "",
      dialogVisible: false,
      dialogactive: 'week',
      dialogorder: {},
      startday: '',
      startTime: '',
      endTime: '',
      dates: [
        {value: '0',label: '星期日'},
        {value: '1',label: '星期一'},
        {value: '2',label: '星期二'},
        {value: '3',label: '星期三'},
        {value: '4',label: '星期四'},
        {value: '5',label: '星期五'},
        {value: '6',label: '星期六'},
      ],
      selecteddates: [],
      datesandtime:[],
      lessondays: [],
      lessontime: [],
    };
  },
  created() {
  },
  computed: {},
  components: {
    headTop
  },
  methods: {
    Clicktab(e) {
      this.activeName = e.name;
      if (e.name == "all") {
        this.showtableData = this.tableData.filter(
          item => item.payed == 1 && item.reviewed == 1
        );
      } else if (e.name == "nolessonday") {
        this.showtableData = this.tableData.filter(
          item =>
            item.payed == 1 &&
            item.reviewed == 1 &&
            item.teachtimes < item.times &&
            item.lessondays.length == 0
        );
      } else if (e.name == "lessonday") {
        this.showtableData = this.tableData.filter(
          item =>
            item.payed == 1 &&
            item.reviewed == 1 &&
            item.teachtimes < item.times &&
            item.lessondays.length >= 1
        );
      } else if (e.name == "teached") {
        this.showtableData = this.tableData.filter(
          item =>
            item.payed == 1 &&
            item.reviewed == 1 &&
            item.teachtimes >= item.times
        );
      }
    },
    clickDialogTab(e){
      console.log(e.name);
      this.dialogactive = e.name;
    },
    clickAddDates(){
      this.datesandtime.push({
        selecteddates: this.selecteddates,
        startTime: this.startTime,
        endTime: this.endTime,
      });
      this.selecteddates = {};
      this.startTime = '';
      this.endTime = '';
    },
    clickSetDates(times){
      console.log(this.startday);
      console.log(this.selecteddates);
      console.log(this.startTime);
      console.log(this.endTime);
      this.datetoarr(times);
    },
    saveDates(){
      if(this.lessondays.length == this.dialogorder.times){
        this.setdate({
          id: this.dialogorder.id,
          lessondays: this.lessondays,
          lessontime: this.lessontime
        })
      }else{
        this.$message("失败，日期数与课时不符");
      }
    },
    havethisday(date){
      date = this.timetodate(date);
      console.log(this.lessondays);
      console.log(date);
      console.log(this.lessondays.indexOf(date));
      if(this.lessondays.indexOf(date) != -1) return true;
      else return false;
    },
    dialogClose(){
      this.dialogVisible = false;
    },
    dialogOpen(input){
      if(this.dialogorder != input){
        this.dialogorder = input;
        this.selecteddates = [];
        this.datesandtime = [];
        this.lessondays = [];
        this.lessontime = [];
        this.startday = '';
        this.startTime = '';
        this.endTime = '';
      }
      
      this.dialogVisible = true;
    },
    timetodate(year_month_day){
      var newdate = '';
      newdate += parseInt(year_month_day.split('-')[0]);
      newdate += '-';
      newdate += parseInt(year_month_day.split('-')[1]);
      newdate += '-';
      newdate += parseInt(year_month_day.split('-')[2]);
      return newdate;
    },
    datetoarr(times){
      // 将星期几数组转换为日期数组
      this.lessondays = [];
      this.lessontime = [];
      console.log(this.starday);
      var myDate = new Date(this.startday);
      console.log(myDate);
      const datesandtime = this.datesandtime;
      var timeeee = 1;
      while(times >= 1){
        timeeee += 1;
        for(var dindex in datesandtime){
          console.log(myDate.getDay() + ',' + datesandtime[dindex].selecteddates.value);
          if(myDate.getDay() == datesandtime[dindex].selecteddates.value){
            this.lessondays.push(
              myDate.getFullYear() + '-' + (parseInt(myDate.getMonth()) + 1) + '-' + myDate.getDate()
            );
            this.lessontime.push(
              datesandtime[dindex].startTime + '~' + datesandtime[dindex].endTime
            );
            times -= 1;
          }
        }
        if(timeeee >= 1000) break;
        myDate = new Date(myDate.getTime() + 24*60*60*1000);
      }
      console.log(this.lessondays);
      console.log(this.lessontime);
    },
    async initData() {
      this.getOrders();
    },
    async getOrders() {
      this.tableData = [];
      const response = await axios.get(
        `${this.$store.state.apiurl}/api/getallorders`,
        {
          data: {},
          headers: {
            token: this.headertoken
          }
        }
      );
      console.log(response);
      const data = response.data;
      if (data.statusCode != 200) {
        this.$message(data.message);
      } else {
        this.tableData = response.data.result;
        this.showtableData = this.tableData;
      }
      this.Clicktab({ name: this.activeName });
    },
    async orderunlock(inputid) {
      const sure = await new Promise((resolve, reject) => {
        this.$msgbox({
          title: "提示",
          message: "确认推进吗？",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              done();
              resolve(true);
            } else {
              done();
              resolve(false);
            }
          }
        });
      });
      if (!sure) return;
      const response = await axios.post(
        `${this.$store.state.apiurl}/api/orderunlock`,
        {
          orderid: inputid
        },
        {
          headers: {
            token: this.headertoken
          }
        }
      );
      const data = response.data;
      console.log(data);
      if (data.statusCode != 200) {
        this.$message(data.message);
      } else {
        this.$message("成功");
      }
      await this.initData();
      this.Clicktab({ name: this.activeName });
    },
    // handleSizeChange(val) {
    //     console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //     this.currentPage = val;
    //     this.offset = (val - 1)*this.limit;
    //     this.getFoods()
    // },
    removeByValue(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          arr.splice(i, 1);
          i--;
        }
      }
    },
    adddate(order) {
      console.log(this.addday + " " + this.addtime);
      order.lessondays.push(this.addday);
      order.lessontime.push(this.addtime);
    },
    deletedate(order, inputindex) {
      console.log(inputindex);
      function removeByValue(arr1, arr2, val) {
        // 删除方法，由于lessondays和tilecontent对齐，可以一起删
        for (let i = 0; i < arr1.length; i += 1) {
          if (arr1[i] === val) {
            arr1.splice(i, 1);
            arr2.splice(i, 1);
            i -= 1;
          }
        }
      }
      removeByValue(order.lessondays, order.lessontime, inputindex);
    },
    async setdate(order) {
      const response = await axios.post(
        `${this.$store.state.apiurl}/api/setlessondays`,
        {
          orderid: order.id,
          lessondays: order.lessondays,
          lessontime: order.lessontime
        },
        {
          headers: {
            token: this.headertoken
          }
        }
      );
      const data = response.data;
      console.log(data);
      if (data.statusCode != 200) {
        this.$message(data.message);
      } else {
        this.$message("成功");
      }
    },
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.inputlength {
  width: 150px;
}
</style>
