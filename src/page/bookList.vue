<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div style="margin: 15px;">
      <el-input placeholder="搜索" v-model="searchinput" class="input-with-select">
        <el-select v-model="searchselect" slot="prepend" placeholder="请选择">
          <el-option label="书名" value="1"></el-option>
          <el-option label="id" value="2"></el-option>
          <el-option label="用户名" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>

    <el-button
      size="small"
      type="success"
      style="margin-left: 15px;margin-bottom: 15px;"
      @click="newBookDialog = true">添加图书</el-button>
    <el-button
      size="small"
      type="danger"
      style="margin-left: 15px;margin-bottom: 15px;"
      @click="sellBookDialog = true">批量售出</el-button>

    <el-tabs v-model="activeName" type="card" @tab-click="Clicktab">
      <el-tab-pane label="所有图书" name="all"></el-tab-pane>
      <el-tab-pane label="在架" name="no"></el-tab-pane>
      <el-tab-pane label="已租出" name="yes"></el-tab-pane>
      <el-tab-pane label="已卖出" name="cancel"></el-tab-pane>
    </el-tabs>
    <div class="table_container">
      <el-table
        :data="showtableData"
        :row-key="row => row.id"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="介绍">
                {{props.row.introduce}}
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
          prop="id">
        </el-table-column>
        <el-table-column
          label="书名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="价格"
          prop="value">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="statu">
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="agreereview(scope.row.onlyid)">借出</el-button>
            <el-button
              size="small"
              type="success"
              @click="agreereview(scope.row.onlyid)">归还</el-button>
            <el-button
              size="small"
              type="warning"
              @click="agreereview(scope.row.onlyid)">修改</el-button>
            <el-button
              size="small"
              type="danger"
              @click="agreereview(scope.row.onlyid)">售出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加图书" :visible.sync="newBookDialog">
      <el-input placeholder="请输入内容" v-model="newBookName" style="margin:5px;">
        <template slot="prepend">书名</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="newBookIntroduce" style="margin:5px;">
        <template slot="prepend">介绍</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="newBookValue" style="margin:5px;">
        <template slot="prepend">价格</template>
      </el-input>
      <el-input placeholder="请输入内容" v-model="newBookRemark" style="margin:5px;">
        <template slot="prepend">备注</template>
      </el-input>
      <span style="margin-left:5px;margin-right:10px;">添加数量</span>
      <el-input-number style="margin:5px;" v-model="newBookCount" @change="handleChange" :min="1" :max="99999" label="添加数量"></el-input-number>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newBookDialog = false">取 消</el-button>
        <el-button type="primary" @click="login()">添 加</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量售出" :visible.sync="sellBookDialog">
      <el-input style="width:40%;" v-model="startid" placeholder="起始id"></el-input> -
      <el-input style="width:40%;" v-model="endid" placeholder="结束id"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newBookDialog = false">取 消</el-button>
        <el-button type="primary" @click="login()">出 售</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import api from "../api";

export default {
  data() {
    return {
      activeName: "all",
      tableData: [],
      showtableData: [],
      headertoken: "",
      searchselect: '',
      searchinput: '',

      // 添加图书
      newBookDialog: false,
      newBookName: '',
      newBookIntroduce: '',
      newBookValue: '',
      newBookRemark: '',
      newBookCount: 1,

      // 批量售出
      sellBookDialog: false,
      startid: '',
      endid: '',
    };
  },
  created() {},
  computed: {},
  components: {
    headTop
  },
  beforeRouteEnter (to, from, next) {
    // 进入页面时执行一次
    next(async vm => {
      const k = await api.query('select * from book');
      console.log(k);
      vm.showtableData = k.data.data;
    });
  },
  methods: {
    Clicktab(e) {
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
    },
    async initData() {
      await this.getReviews();
      this.Clicktab({ name: this.activeName });
    },
    async getReviews() {
      const _this = this;
    },
    async agreereview(inputonlyid) {

    },
    async cancelreview(inputonlyid) {

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
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
