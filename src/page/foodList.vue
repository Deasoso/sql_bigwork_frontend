<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-input v-model="headertoken" placeholder="请输入header">
        </el-input>
        <el-button type="primary" @click="initData">获取审核信息</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
            <el-tab-pane label="所有" name="all"></el-tab-pane>
            <el-tab-pane label="未审核" name="no"></el-tab-pane>
            <el-tab-pane label="已通过" name="yes"></el-tab-pane>
            <el-tab-pane label="未通过" name="cancel"></el-tab-pane>
        </el-tabs>
        <div class="table_container">
            <el-table
                :data="showtableData"
                ref="eltable"
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
                      @click="agreereview(scope.row.onlyid)">通过</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="cancelreview(scope.row.onlyid)">不通过</el-button>
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
      console.log(this.$refs.eltable);
      this.activeName = e.name;
      console.log(e.name);
      if (e.name == "all") {
        this.showtableData = this.tableData;
      } else if (e.name == "no") {
        this.showtableData = this.tableData.filter(item => item.reviewed === 1);
      } else if (e.name == "yes") {
        this.showtableData = this.tableData.filter(item => item.reviewed === 2);
      } else if (e.name == "cancel") {
        this.showtableData = this.tableData.filter(item => item.reviewed === 3);
      }
      this.$refs.eltable.data = this.showtableData;
    },
    async initData() {
      await this.getReviews();
      this.Clicktab({ name: this.activeName });
    },
    async getReviews() {
      const _this = this;
      this.tableData = [];
      const response = await axios.get(
        `${this.$store.state.apiurl}/api/getallreviews`,
        {
          data: {},
          headers: {
            token: this.headertoken
          }
        }
      );
      const data = response.data;
      console.log(data);
      if (data.statusCode != 200) {
        _this.$message(data.message);
      } else {
        _this.tableData = response.data.result;
        _this.tableData.forEach((item, index) => {
          if (_this.tableData[index].reviewed == 0)
            _this.tableData[index].reviewedtext = "未提交";
          else if (_this.tableData[index].reviewed == 1)
            _this.tableData[index].reviewedtext = "未审核";
          else if (_this.tableData[index].reviewed == 2)
            _this.tableData[index].reviewedtext = "已通过";
          else if (_this.tableData[index].reviewed == 3)
            _this.tableData[index].reviewedtext = "未通过";
          else _this.tableData[index].reviewedtext = "出错";
        });
        _this.showtableData = _this.tableData;
      }
    },
    // handleSizeChange(val) {
    //     console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //     this.currentPage = val;
    //     this.offset = (val - 1)*this.limit;
    //     this.getReviews()
    // },
    async agreereview(inputonlyid) {
      const res = await axios.post(
        `${this.$store.state.apiurl}/api/agreereview`,
        { onlyid: inputonlyid },
        {
          headers: {
            token: this.headertoken
          }
        }
      );
      const data = res.data;
      console.log(data);
      if (data.statusCode != 200) {
        this.$message(data.message);
      } else {
        this.$message("成功");
      }
      await this.getReviews();
      this.$message("成功");
      this.Clicktab({ name: this.activeName });
      console.log(res);
    },
    async cancelreview(inputonlyid) {
      const value = await new Promise((resolve, reject) => {
        this.$prompt("请输入不通过原因", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(({ value }) => {
            resolve(value);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
            resolve("-1");
          });
      });
      if (value == "-1") return;
      const res = await axios.post(
        `${this.$store.state.apiurl}/api/cancelreview`,
        {
          onlyid: inputonlyid,
          failtext: value
        },
        {
          headers: {
            token: this.headertoken
          }
        }
      );
      await this.getReviews();
      this.$message("成功");
      this.Clicktab({ name: this.activeName });
      console.log(res);
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
