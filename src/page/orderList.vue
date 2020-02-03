<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
        <el-button type="primary" @click="initData">获取订单信息</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
            <el-tab-pane label="待审核——家长订单" name="nonorder"></el-tab-pane>
            <el-tab-pane label="未匹配——家长订单" name="order"></el-tab-pane>
            <el-tab-pane label="未匹配——教师" name="tea"></el-tab-pane>
            <el-tab-pane label="已匹配" name="done"></el-tab-pane>
            <el-tab-pane label="已支付" name="payed"></el-tab-pane>
        </el-tabs>
        <!-- 显示订单表格 -->
        <div class="table_container" v-show="activeName!='tea'">
            <el-table
                :data="showtableData"
                ref="ordtable"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="上课时间">
                            <div v-for="item,index in props.row.lessondays" :key="index">
                                {{props.row.lessondays[index]}}
                                {{props.row.lessontime[index]}}
                                <el-button
                                    size="small"
                                    type="danger"
                                    @click="deletedate(props.row, props.row.lessondays[index])">
                                    删除
                                </el-button>
                            </div>
                            <el-input v-model="addday" class="inputlength" placeholder="输入增加日期"></el-input>
                            <el-input v-model="addtime" class="inputlength" placeholder="输入增加时间"></el-input>
                            <el-button
                                size="small"
                                type="success"
                                @click="adddate(props.row)">
                                添加
                            </el-button>
                            <el-button
                                size="small"
                                type="info"
                                @click="setdate(props.row)">
                                确认
                            </el-button>
                        </el-form-item>
                        <el-form-item v-if="props.row.teacher != undefined" label="教师姓" class="half-item">
                            {{props.row.teacher.firstname}}
                        </el-form-item>
                        <el-form-item v-if="props.row.teacher != undefined" label="教师名" class="half-item">
                            {{props.row.teacher.lastname}}
                        </el-form-item>
                        <el-form-item v-if="props.row.teacher != undefined" label="教师手机" class="half-item">
                            {{props.row.teacher.wxnum}}
                        </el-form-item>
                        <el-form-item label="标记价格">
                            <el-input v-model="markvalue" class="inputlength" placeholder="输入价格"></el-input>
                            <el-button
                                size="small"
                                type="info"
                                @click="markordervalue(props.row.id)">
                                确认标记
                            </el-button>
                        </el-form-item>
                        <el-form-item label="删除操作">
                            <el-button
                                size="small"
                                type="danger"
                                @click="deleteorder(props.row.id)">
                                删除订单
                            </el-button>
                        </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="年级科目"
                  prop="subject">
                </el-table-column>
                <el-table-column
                  label="标记价格"
                  prop="markvalue">
                </el-table-column>
                <el-table-column
                  label="地区"
                  prop="area">
                </el-table-column>
                <el-table-column
                  label="孩子性别"
                  prop="gender">
                </el-table-column>
                <el-table-column
                  label="家长手机号"
                  prop="wxnum">
                </el-table-column>
                <el-table-column
                  label="老师性别要求"
                  prop="teagender">
                </el-table-column>
                <el-table-column
                  label="授课方式1线上2线下"
                  prop="teachway">
                </el-table-column>
                <el-table-column
                  label="上课次数"
                  prop="times">
                </el-table-column>
                <el-table-column
                  label="地址"
                  prop="address">
                </el-table-column>
                <el-table-column
                  label="孩子简介"
                  prop="kid">
                </el-table-column>
                <el-table-column
                  label="备注"
                  prop="remark">
                </el-table-column>
                <el-table-column
                  label="总价"
                  prop="value">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                        :ref="'match' + scope.row.id" 
                        size="small"
                        :type="getbuttontype(scope.row.id)"
                        @click="matchorder(scope.row.id)"
                        v-show="activeName=='order' && scope.row.intentionlist.length != 0">
                        匹配
                    </el-button>
                    <el-button
                        :ref="'match' + scope.row.id" 
                        size="small"
                        type="success"
                        @click="revieworder(scope.row.id)"
                        v-show="activeName=='nonorder'">
                        审核通过
                    </el-button>
                    <el-button
                        :ref="'match' + scope.row.id" 
                        size="small"
                        type="danger"
                        @click="unrevieworder(scope.row.id)"
                        v-show="activeName=='nonorder'">
                        审核不通过
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
        <!-- 显示教师表格 -->
        <div class="table_container" v-show="activeName =='tea'">
            <el-table
                :data="showteatableData"
                ref="teatable"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="地区">
                            {{props.row.area}}
                        </el-form-item>
                        <el-form-item label="身份证照片">
                            <img
                                style="max-width: 48%;"
                                :src="props.row.picurls.idarr[0]">
                            </img>
                            <img
                                style="max-width: 48%;"
                                :src="props.row.picurls.idarr[1]">
                            </img>
                        </el-form-item>
                        <el-form-item label="学生证照片">
                            <span v-for="item,index in props.row.picurls.stuarr" :key="index">
                                <img
                                    style="max-width: 48%;"
                                    :src="props.row.picurls.stuarr[index]">
                                </img>
                            </span>
                        </el-form-item>
                        <el-form-item label="教师证照片">
                            <span v-for="item,index in props.row.picurls.teaarr" :key="index">
                                <img
                                    style="max-width: 48%;"
                                    :src="props.row.picurls.teaarr[index]">
                                </img>
                            </span>
                        </el-form-item>
                        <el-form-item label="自我介绍">
                            <span>{{ props.row.introduce }}</span>
                        </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="姓"
                  prop="firstname">
                </el-table-column>
                <el-table-column
                  label="名"
                  prop="lastname">
                </el-table-column>
                <el-table-column
                  label="通过情况"
                  prop="reviewedtext">
                </el-table-column>
                <el-table-column
                  label="手机号"
                  prop="wxnum">
                </el-table-column>
                <el-table-column
                  label="性别"
                  prop="gender">
                </el-table-column>
                <el-table-column
                  label="科目"
                  prop="subject">
                </el-table-column>
                <el-table-column
                  label="入学年份"
                  prop="admissionyear">
                </el-table-column>
                <el-table-column
                  label="毕业学校"
                  prop="graduationschool">
                </el-table-column>
                <el-table-column
                  label="学历"
                  prop="education">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="success"
                      @click="matchteacher(scope.row.onlyid)">匹配</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="teacurrentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div> -->
        </div>
    </div>
</template>

<script>
const axios = require("axios");
import headTop from "../components/headTop";
import { SIGUSR1 } from "constants";
export default {
  data() {
    return {
      activeName: "order",
      offset: 0,
      limit: 20,
      count: 1,
      tableData: [],
      showtableData: [],
      teatableData: [],
      showteatableData: [],
      currentPage: 1,
      teacurrentPage: 1,
      headertoken: "",
      matcharr: [],
      addday: "",
      addtime: "",
      markvalue: 0
    };
  },
  created() {},
  computed: {},
  components: {
    headTop
  },
  methods: {
    Clicktab(e) {
      this.activeName = e.name;
      if (e.name == "order") {
        this.showtableData = this.tableData.filter(
          item => item.ready == 0 && item.reviewed == 1
        );
        this.$refs.ordtable.data = this.showtableData;
      } else if (e.name == "tea") {
        this.showteatableData = this.teatableData.filter(item => {
          var have = false;
          for (var i2 = 0; i2 < this.matcharr.length; i2++) {
            if (
              item.intentionlist.indexOf(this.matcharr[i2]) != -1 &&
              item.reviewed == 2
            ) {
              // 这里的review是教师审核，其它review是订单审核
              have = true;
            }
          }
          return have;
        });
        this.$refs.teatable.data = this.showteatableData;
        console.log(this.showteatableData);
        // this.showtableData = this.tableData.filter(item => item.reviewed === 1)
      } else if (e.name == "done") {
        this.showtableData = this.tableData.filter(
          item => item.payed == 0 && item.ready == 1 && item.reviewed == 1
        );
        this.$refs.ordtable.data = this.showtableData;
      } else if (e.name == "payed") {
        this.showtableData = this.tableData.filter(
          item => item.payed == 1 && item.reviewed == 1
        );
        this.$refs.ordtable.data = this.showtableData;
      } else if (e.name == "nonorder") {
        this.showtableData = this.tableData.filter(item => item.reviewed == 0);
        this.$refs.ordtable.data = this.showtableData;
      }
    },
    async initData() {
      this.getOrders();
      this.getTeachers();
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
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    //   this.offset = (val - 1) * this.limit;
    //   this.getOrders();
    // },
    async revieworder(inputid) {
      const response = await axios.post(
        `${this.$store.state.apiurl}/api/revieworder`,
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
    async unrevieworder(inputid) {
      const response = await axios.post(
        `${this.$store.state.apiurl}/api/unrevieworder`,
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
    async markordervalue(inputid) {
      const response = await axios.post(
        `${this.$store.state.apiurl}/api/markordervalue`,
        {
          orderid: inputid,
          markvalue: this.markvalue
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
    async deleteorder(inputid) {
      const sure = await new Promise((resolve, reject) => {
        this.$msgbox({
          title: "提示",
          message: "确认删除吗？",
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
        `${this.$store.state.apiurl}/api/deleteorder`,
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
    async matchorder(inputid) {
      console.log(this.matcharr);
      if (this.$refs["match" + inputid].type == "success") {
        if (this.matcharr.indexOf(inputid) == -1) {
          this.$refs["match" + inputid].type = "danger";
          this.matcharr.push(inputid);
        }
      } else {
        this.$refs["match" + inputid].type = "success";
        this.removeByValue(this.matcharr, inputid);
      }
      console.log(this.matcharr);
    },
    async matchteacher(inputonlyid) {
      for (var i = 0; i < this.matcharr; i++) {
        console.log(inputonlyid);
        console.log(this.matcharr[i]);
        const response = await axios.post(
          `${this.$store.state.apiurl}/api/matchorder`,
          {
            teacherid: inputonlyid,
            orderid: this.matcharr[i]
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
      }
      this.matcharr = [];
      await this.initData();
      this.Clicktab({ name: this.activeName });
    },
    removeByValue(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          arr.splice(i, 1);
          i--;
        }
      }
    },
    async getTeachers() {
      this.teatableData = [];
      const response = await axios.get(
        `${this.$store.state.apiurl}/api/getallreviews`,
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
        this.teatableData = response.data.result;
        this.teatableData.forEach((item, index) => {
          if (this.teatableData[index].reviewed == 0)
            this.teatableData[index].reviewedtext = "未提交";
          else if (this.teatableData[index].reviewed == 1)
            this.teatableData[index].reviewedtext = "未审核";
          else if (this.teatableData[index].reviewed == 2)
            this.teatableData[index].reviewedtext = "已通过";
          else if (this.teatableData[index].reviewed == 3)
            this.teatableData[index].reviewedtext = "未通过";
          else this.teatableData[index].reviewedtext = "出错";
        });
        this.showteatableData = this.teatableData;
      }
      this.teatableData = this.teatableData.filter(item => item.reviewed === 2);
      this.Clicktab({ name: this.activeName });
    },
    getbuttontype(id) {
      if (this.matcharr.indexOf(id) > -1) {
        return "danger";
      } else {
        return "success";
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
    }
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
