<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
        <el-button type="primary" @click="initData">获取好友推荐信息</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="未确认" name="noconfirmed"></el-tab-pane>
            <el-tab-pane label="已确认" name="confirmed"></el-tab-pane>
        </el-tabs>
        <!-- 显示教师表格 -->
        <div class="table_container">
            <el-table
                :data="showcouponData"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="用户名称">
                            {{props.row.user.nickname}}
                        </el-form-item>
                        <el-form-item label="用户性别">
                            {{props.row.user.gender}}
                        </el-form-item>
                        <el-form-item label="用户手机">
                            {{props.row.user.phonenumber}}
                        </el-form-item>
                        <el-form-item label="孩子姓名">
                            {{props.row.user.kidname}}
                        </el-form-item>
                        <el-form-item label="孩子年级">
                            {{props.row.user.kidgrade}}
                        </el-form-item>
                        <el-form-item label="孩子性别">
                            {{props.row.user.kidgender}}
                        </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="推荐人"
                  prop="user.nickname">
                </el-table-column>
                <el-table-column
                  label="被推荐人手机号"
                  prop="phonenumber">
                </el-table-column>
                <el-table-column
                  label="城市"
                  prop="city">
                </el-table-column>
                <el-table-column
                  label="科目"
                  prop="subject">
                </el-table-column>
                <el-table-column
                  label="备注"
                  prop="remark">
                </el-table-column>
                <el-table-column
                  label="类型"
                  prop="typename">
                </el-table-column>
                <el-table-column
                  label="优惠券剩余数量"
                  prop="amount">
                </el-table-column>
                <el-table-column
                  label="是否确认"
                  prop="confirmedname">
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="success"
                      @click="confirmcoupon(scope.row.id)">推荐成功</el-button>
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

export default {
  data() {
    return {
      activeName: "all",
      offset: 0,
      limit: 20,
      count: 1,
      couponData: [],
      showcouponData: [],
      userData: [], // 用来显示邀请者的信息
      teacurrentPage: 1,
      headertoken: ""
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
      console.log(this.couponData);
      if (e.name == "all") {
        this.showcouponData = this.couponData;
      } else if (e.name == "noconfirmed") {
        this.showcouponData = this.couponData.filter(
          item => item.confirmed == 0
        );
      } else if (e.name == "confirmed") {
        this.showcouponData = this.couponData.filter(
          item => item.confirmed == 1
        );
      }
    },
    async initData() {
      await this.getAllUsers();
      await this.getCoupons();
    },
    // handleSizeChange(val) {
    //     console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //     this.currentPage = val;
    //     this.offset = (val - 1)*this.limit;
    //     this.getFoods()
    // },
    async confirmcoupon(inputonlyid) {
      const sure = await new Promise((resolve, reject) => {
        this.$msgbox({
          title: "提示",
          message: "确认推荐成功吗？",
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
      console.log(inputonlyid);
      const response = await axios.post(
        `${this.$store.state.apiurl}/api/confirmcoupon`,
        {
          couponid: inputonlyid
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
    async getAllUsers() {
      this.tableData = [];
      const response = await axios.get(
        `${this.$store.state.apiurl}/api/getallusers`,
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
        this.userData = response.data.result;
      }
    },
    async getCoupons() {
      this.couponData = [];
      const response = await axios.get(
        `${this.$store.state.apiurl}/api/getallcoupons`,
        {
          data: {},
          headers: {
            token: this.headertoken
          }
        }
      );
      const data = response.data;
      if (data.statusCode != 200) {
        this.$message(data.message);
      } else {
        console.log(data);
        this.couponData = response.data.result;
        this.couponData.forEach((item, index) => {
          item.user = this.userData.filter(
            user => user.onlyid == item.owner
          )[0];
          item.confirmedname = item.confirmed == 1 ? '是' : '否';
          item.typename = item.type == 1 ? '优惠券' : '提现';
        });
        this.showcouponData = this.couponData;
      }
      this.Clicktab({ name: this.activeName });
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
  width: 130px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
</style>
