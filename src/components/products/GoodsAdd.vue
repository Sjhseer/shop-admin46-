<template>
  <div class="goodsadd">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤1" description="基本信信"></el-step>
      <el-step title="步骤2" description="商品图片"></el-step>
      <el-step title="步骤3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
      <el-tab-pane name="0" label=" 基本信息">
        <el-form ref="form" :model="form">
          <el-form-item label="商品名称" label-width="80px">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" label-width="80px">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" label-width="80px">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" label-width="80px">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" label-width="80px">
            <el-cascader v-model="form.goods_cat" :options="options" :props="props"></el-cascader>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-top: 12px;" @click="next">下一步</el-button>
      </el-tab-pane>
      <!-- 上传图片 -->
      <el-tab-pane name="1" label="商品图片">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          name="file"
          multiple
          list-type="picture-card"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <el-button type="primary" style="margin-top: 12px;" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="2" label=" 商品内容">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" style="margin-top: 12px;" @click="addgod">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [] // 用于存放所有图片的地址
      },
      options: [],
      props: {
        value: 'cat_id', // id
        label: 'cat_name', // 内容
        children: 'children'
      },
      activeName: '0',
      // 上传图片
      headers: { Authorization: localStorage.getItem('token') },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('categories?type=3')
    // console.log(data)
    if (meta.status === 200) {
      this.options = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    next () {
      this.active++
      this.activeName = this.active + ''// 转成字符串
    },
    handleClick (tab) {
      this.active = +tab.index
    },
    handleSuccess (response, file) {
      const { data, meta } = response
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 删除图片并在地址中删除
    handleRemove (file, fileList) {
      console.log(file)
      const pic = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== pic)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 添加
    async addgod () {
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      console.log(meta)
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('./goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
//方法1直接不写scoped
.quill-editor {
  ::v-deep .ql-container {
    min-height: 300px;
  }
}
</style>
