<template>
    <!-- 教师提现页面 -->
    <div class="fillcontain">
        <head-top></head-top>
        <el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
        <el-button type="primary" @click="initData">获取教师信息</el-button>
        <!-- 显示教师表格 -->
        <div class="table_container">
            <el-table
                :data="showteatableData"
                ref="teatable"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="身份证照片">
                            <img
                                style="max-width: 48%;"
                                :src="props.row.picurls.idarr[0]">
                            </img>
                            <img
                                style="max-width: 48%;"
                                :src="props.row.picurls.idarr[1]">
                            </img>
                            <!-- <span>{{ props.row.picurls.idarr[0] }}</span> -->
                        </el-form-item>
                        <el-form-item label="学生证照片">
                            <span v-for="item,index in props.row.picurls.stuarr" :key="index">
                                <img
                                    style="max-width: 48%;"
                                    :src="props.row.picurls.stuarr[index]">
                                </img>
                            </span>
                            <!-- <span>{{ props.row.picurls.idarr[0] }}</span> -->
                        </el-form-item>
                        <el-form-item label="教师证照片">
                            <span v-for="item,index in props.row.picurls.teaarr" :key="index">
                                <img
                                    style="max-width: 48%;"
                                    :src="props.row.picurls.teaarr[index]">
                                </img>
                            </span>
                            <!-- <span>{{ props.row.picurls.idarr[0] }}</span> -->
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
                  label="推送情况"
                  prop="pushed">
                </el-table-column>
                <el-table-column
                  label="手机号"
                  prop="wxnum">
                </el-table-column>
                <el-table-column
                  label="余额"
                  prop="balance">
                </el-table-column>
                <el-table-column
                  label="提现金额"
                  prop="withdraw">
                </el-table-column>
                </el-table-column>
                <el-table-column label="操作" width="160">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="success"
                      @click="withdraw(scope.row.onlyid, scope.row.withdraw)">全部确认提现</el-button>
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
      teatableData: [],
      showteatableData: [],
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
    async initData() {
      this.getTeachers();
    },
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    //   this.offset = (val - 1) * this.limit;
    //   this.getTeachers();
    // },
    async withdraw(inputonlyid, inputwithdraw) {
      const response = await axios.post(
        `https://api.deaso40.com/api/withdrawed`,
        {
          onlyid: inputonlyid,
          value: inputwithdraw
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
    async getTeachers() {
      this.teatableData = [];
      const response = await axios.get(
        `https://api.deaso40.com/api/getallreviews`,
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
        this.teatableData = response.data.result;
        this.showteatableData = this.teatableData;
      }
      this.teatableData = this.teatableData.filter(item => item.reviewed === 2);
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
</style>
