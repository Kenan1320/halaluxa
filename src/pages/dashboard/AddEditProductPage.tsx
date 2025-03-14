import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, Switch, Select, InputNumber, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { getCategories } from '@/services/categoryService';
import { getProductById, createProduct, updateProduct } from '@/services/productService';
import DashboardLayout from '@/components/layout/DashboardLayout';

const { TextArea } = Input;

const AddEditProductPage = () => {
  const [form] = Form.useForm();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<string[]>([]);
  const { user } = useAuth();

  const [longDescription, setLongDescription] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use getCategories instead of listCategories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to load categories');
      }
    };

    fetchCategories();
    
    if (productId) {
      setLoading(true);
      getProductById(productId)
        .then(product => {
          if (product) {
            form.setFieldsValue({
              name: product.name,
              description: product.description,
              price: product.price,
              category: product.category,
              isHalalCertified: product.isHalalCertified,
              inStock: product.inStock,
            });
            setProductImage(product.images);
            setLongDescription(product.description);
          }
        })
        .catch(error => {
          console.error('Error fetching product:', error);
          message.error('Failed to load product');
        })
        .finally(() => setLoading(false));
    }
  }, [productId]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const productData = {
        ...values,
        images: productImage,
        shop_id: user?.id,
        is_halal_certified: values.isHalalCertified,
        in_stock: values.inStock,
        long_description: longDescription
      };

      if (productId) {
        // Update existing product
        const updatedProduct = await updateProduct(productId, productData);
        if (updatedProduct) {
          message.success('Product updated successfully');
        } else {
          message.error('Failed to update product');
        }
      } else {
        // Create new product
        const newProduct = await createProduct(productData);
        if (newProduct) {
          message.success('Product created successfully');
          navigate('/dashboard/products');
        } else {
          message.error('Failed to create product');
        }
      }
    } catch (error) {
      console.error('Error creating/updating product:', error);
      message.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (info: any) => {
    if (info.file.status === 'done') {
      // Assuming the server returns the image URL in the response
      const imageUrl = info.file.response.url;
      setProductImage([imageUrl]);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="container">
        <h1>{productId ? 'Edit Product' : 'Add Product'}</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          loading={loading}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter product description' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="long_description"
            label="Long Description"
          >
            <TextArea rows={4} value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter product price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `QR ${value}`}
              parser={value => value.replace('QR', '')}
            />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select product category' }]}
          >
            <Select>
              {categories.map((category: any) => (
                <Select.Option key={category.id} value={category.name}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="isHalalCertified"
            label="Is Halal Certified"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="inStock"
            label="In Stock"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Upload Product Image">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2124"
              beforeUpload={() => false}
              onChange={handleImageUpload}
            >
              {productImage ? <img src={productImage[0]} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {productId ? 'Update Product' : 'Add Product'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default AddEditProductPage;
