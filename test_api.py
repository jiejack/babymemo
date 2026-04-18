import requests
import json

def test_register():
    """测试注册功能"""
    print("=== 测试注册功能 ===")
    
    url = 'http://localhost:3000/api/users/register'
    data = {
        'username': 'testuser123',
        'password': 'password123',
        'name': '测试用户'
    }
    
    response = requests.post(url, json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    return response.status_code

def test_login():
    """测试登录功能"""
    print("\n=== 测试登录功能 ===")
    
    url = 'http://localhost:3000/api/users/login'
    data = {
        'username': 'testuser123',
        'password': 'password123'
    }
    
    response = requests.post(url, json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    return response.status_code

def test_me():
    """测试获取当前用户信息"""
    print("\n=== 测试获取当前用户信息 ===")
    
    # 先登录获取token
    login_url = 'http://localhost:3000/api/users/login'
    login_data = {
        'username': 'testuser123',
        'password': 'password123'
    }
    
    login_response = requests.post(login_url, json=login_data)
    login_result = login_response.json()
    
    if login_result.get('status') == 'success' and login_result.get('data') and login_result.get('data').get('token'):
        token = login_result['data']['token']
        
        me_url = 'http://localhost:3000/api/users/me'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        
        me_response = requests.get(me_url, headers=headers)
        print(f"状态码: {me_response.status_code}")
        print(f"响应: {me_response.json()}")
        
        return me_response.status_code
    else:
        print("登录失败，无法测试获取用户信息")
        return 401

if __name__ == "__main__":
    print("开始测试 API 功能...")
    
    register_status = test_register()
    login_status = test_login()
    me_status = test_me()
    
    print("\n=== 测试结果 ===")
    print(f"注册功能: {'成功' if register_status == 201 else '失败'}")
    print(f"登录功能: {'成功' if login_status == 200 else '失败'}")
    print(f"获取用户信息: {'成功' if me_status == 200 else '失败'}")
