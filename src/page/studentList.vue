<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
        <el-button type="primary" @click="initData">获取学生信息</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
            <el-tab-pane label="全部学生" name="all"></el-tab-pane>
            <el-tab-pane label="已标记学生" name="teaching"></el-tab-pane>
            <el-tab-pane label="未标记学生" name="teached"></el-tab-pane>
        </el-tabs>
        <!-- 显示订单表格 -->
        <div class="table_container" v-show="activeName!='tea'">
            <el-table
                :data="showtableData"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column
                  label="姓名"
                  prop="kidname">
                </el-table-column>
                <el-table-column
                  label="性别"
                  prop="kidgender">
                </el-table-column>
                <el-table-column
                  label="年级"
                  prop="kidgrade">
                </el-table-column>
                <el-table-column
                  label="电话"
                  prop="phonenumber">
                </el-table-column>
                <el-table-column
                  label="老师"
                  prop="kid">
                </el-table-column>
                <el-table-column
                  label="剩余课时"
                  prop="teachtimes">
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
      addtime: ""
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
      if (e.name == "all") {
        this.showtableData = this.tableData.filter(
          item => item.payed == 1 && item.reviewed == 1
        );
      } else if (e.name == "teaching") {
        this.showtableData = this.tableData.filter(
          item =>
            item.payed == 1 &&
            item.reviewed == 1 &&
            item.teachtimes < item.times
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
